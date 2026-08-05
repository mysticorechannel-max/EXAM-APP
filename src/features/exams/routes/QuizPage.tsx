import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Spinner } from '@/shared/components';
import { useExamDetails } from '../hooks/useExamDetails';
import { useQuestions } from '@/features/questions/hooks/useQuestions';
import { useSubmitExam } from '../hooks/useSubmitExam';
import type { SubmissionAnswer } from '../types/submission.types';

export function QuizPage() {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

    const { data: exam, isLoading: examLoading } = useExamDetails(examId ?? '');
    const { data: questionsData, isLoading: questionsLoading } = useQuestions(examId ?? '');
    const submitMutation = useSubmitExam();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const hasSubmittedRef = useRef(false);

    const questions = questionsData ?? [];
    const totalQuestions = questions.length;
    const currentQuestion = questions[currentIndex];
    const allAnswered = totalQuestions > 0 && Object.keys(answers).length === totalQuestions;
    const isLastQuestion = currentIndex === totalQuestions - 1;

    useEffect(() => {
        if (exam?.duration) {
            setTimeLeft(exam.duration * 60);
            startTimeRef.current = Date.now();
        }
    }, [exam]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null) return null;
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleSubmit = useCallback(() => {
        if (hasSubmittedRef.current || !examId) return;
        hasSubmittedRef.current = true;
        const submissionAnswers: SubmissionAnswer[] = questions.map((q) => ({
            questionId: q.id,
            answerId: answers[q.id] ?? '',
        }));
        submitMutation.mutate(
            { examId, answers: submissionAnswers, startedAt: new Date(startTimeRef.current).toISOString() },
            {
                onSuccess: (data) => {
                    navigate(`/dashboard/exams/${examId}/results`, {
                        state: { submission: data.submission, analytics: data.analytics, questions, userAnswers: answers },
                        replace: true,
                    });
                },
                onError: () => { hasSubmittedRef.current = false; },
            }
        );
    }, [examId, questions, answers, navigate, submitMutation]);

    useEffect(() => {
        if (timeLeft === 0 && !hasSubmittedRef.current) handleSubmit();
    }, [timeLeft, handleSubmit]);

    const handleSelectAnswer = (questionId: string, answerId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    };

    const handleNext = () => {
        if (isLastQuestion) { if (allAnswered) handleSubmit(); return; }
        setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (examLoading || questionsLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!exam || !currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
                <p className="text-sm text-gray-600">Failed to load quiz data.</p>
                <Link to="/dashboard/diplomas" className="mt-3 rounded-lg bg-[#155DFC] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Back to Diplomas
                </Link>
            </div>
        );
    }

    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    return (
        <div className="flex flex-col gap-4">
            {/* Blue banner with separate back button */}
            <div className="flex items-stretch gap-2">
                <Link
                    to="/dashboard/diplomas"
                    className="flex w-[48px] items-center justify-center border border-[#155DFC] text-[#155DFC] hover:bg-blue-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div className="flex flex-1 items-center gap-3 bg-[#155DFC] px-6 py-4">
                    <HelpCircle className="h-6 w-6 text-white" />
                    <h1 className="font-[Geist_Mono] text-[14px] font-semibold text-white">
                        {exam.title} Questions
                    </h1>
                </div>
            </div>

            {/* Question counter + Timer row */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <p className="font-[Geist_Mono] text-sm text-gray-700">
                        Question <span className="font-bold">{currentIndex + 1}</span> of {totalQuestions}
                    </p>
                    {/* Progress bar */}
                    <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-[#155DFC] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                {/* Timer */}
                {timeLeft !== null && (
                    <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] border-[#155DFC]">
                        <span className="font-[Geist_Mono] text-[11px] font-bold text-[#155DFC]">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                )}
            </div>

            {/* Question + Answers card */}
            <div className="rounded-xl border border-gray-200 bg-white">
                {/* Question text */}
                <div className="px-6 pt-6 pb-4">
                    <h2 className="font-[Geist_Mono] text-base font-bold text-[#155DFC]">
                        {currentQuestion.text}
                    </h2>
                </div>

                {/* Answer options */}
                <div className="flex flex-col">
                    {currentQuestion.answers.map((answer) => {
                        const isSelected = answers[currentQuestion.id] === answer.id;
                        return (
                            <button
                                key={answer.id}
                                type="button"
                                onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                                className={`flex items-center gap-3 border-t border-gray-100 px-6 py-4 text-left transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? 'border-[#155DFC]' : 'border-gray-300'
                                    }`}>
                                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#155DFC]" />}
                                </div>
                                <span className={`font-[Geist_Mono] text-sm ${isSelected ? 'font-medium text-[#155DFC]' : 'text-gray-700'}`}>
                                    {answer.text}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Navigation buttons inside card */}
                <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 py-3 font-[Geist_Mono] text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isLastQuestion && !allAnswered}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#155DFC] py-3 font-[Geist_Mono] text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLastQuestion ? 'Finish' : 'Next'}
                        {!isLastQuestion && <ChevronRight className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Submitting overlay */}
            {submitMutation.isPending && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-lg">
                        <Spinner size="md" />
                        <span className="text-sm font-medium text-gray-700">Submitting...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
