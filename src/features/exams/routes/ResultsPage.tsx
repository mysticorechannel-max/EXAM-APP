import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CircleHelp, RotateCcw } from 'lucide-react';
import folderSearchIcon from '../../../lucide/folder-search.svg';
import { useExamDetails } from '../hooks/useExamDetails';
import type { Question } from '@/features/questions/types/question.types';
import type { AnalyticsItem } from '../types/submission.types';

interface ResultsState {
    submission: {
        id?: string;
        _id?: string;
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        wrongAnswers: number;
        examTitle?: string;
        exam?: { id: string; title: string; duration: number };
    };
    analytics?: AnalyticsItem[];
    questions: Question[];
    userAnswers: Record<string, string>;
}

function AnswerRow({
    text,
    variant,
}: {
    text: string;
    variant: 'correct' | 'incorrect' | 'correct-unselected';
}) {
    const isIncorrect = variant === 'incorrect';
    const isUnselected = variant === 'correct-unselected';

    return (
        <div
            className={`flex items-center gap-3 px-3 py-2 ${
                isIncorrect ? 'bg-red-50' : 'bg-green-50'
            }`}
        >
            <div
                className={`radio-circle flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 ${
                    isIncorrect ? 'border-red-500' : 'border-[#00BC7D]'
                }`}
            >
                {!isUnselected && (
                    <div
                        className={`radio-circle h-2.5 w-2.5 ${
                            isIncorrect ? 'bg-red-500' : 'bg-[#00BC7D]'
                        }`}
                    />
                )}
            </div>
            <span className="font-[Geist_Mono] text-xs text-gray-700">{text}</span>
        </div>
    );
}

export function ResultsPage() {
    const { examId } = useParams<{ examId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as ResultsState | null;
    const { data: exam } = useExamDetails(examId ?? '');

    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center border border-gray-200 bg-white py-16">
                <p className="text-sm text-gray-600">No results data available.</p>
                <button
                    type="button"
                    onClick={() => navigate('/dashboard/diplomas')}
                    className="mt-3 bg-[#155DFC] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Back to Diplomas
                </button>
            </div>
        );
    }

    const { submission, analytics, userAnswers } = state;
    const questions = state.questions ?? [];
    const examTitle = exam?.title || submission.examTitle || submission.exam?.title || 'Exam';
    const diplomaTitle = exam?.diploma?.title ?? 'Diploma';
    const total = submission.totalQuestions;
    const correct = submission.correctAnswers;
    const wrong = submission.wrongAnswers;

    // Donut chart - matching Figma (203x203 viewBox, thick ring)
    const chartSize = 203;
    const chartCenter = chartSize / 2;
    const outerR = 82;
    const strokeW = 38;
    const chartRadius = outerR - strokeW / 2;
    const circumference = 2 * Math.PI * chartRadius;
    const correctPercent = total > 0 ? (correct / total) * 100 : 0;
    const correctStroke = (correctPercent / 100) * circumference;
    const wrongStroke = circumference - correctStroke;

    return (
        <div className="flex flex-col gap-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 font-[Geist_Mono] text-sm text-gray-500">
                <Link to="/dashboard/diplomas" className="transition-colors hover:text-gray-900">
                    Diplomas
                </Link>
                <span>/</span>
                <span className="transition-colors hover:text-gray-900">{diplomaTitle}</span>
                <span>/</span>
                <span className="font-medium text-[#155DFC]">{examTitle}</span>
            </nav>

            {/* Blue banner with separate back button */}
            <div className="flex items-stretch gap-3">
                <Link
                    to="/dashboard/diplomas"
                    className="flex w-[45px] items-center justify-center border border-[#155DFC] text-[#155DFC] hover:bg-blue-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div className="flex flex-1 items-center gap-3 bg-[#155DFC] px-5 py-3">
                    <CircleHelp className="h-7 w-7 text-white" />
                    <h1 className="font-sans text-[24px] font-bold text-white">
                        {examTitle} Questions
                    </h1>
                </div>
            </div>

            {/* Progress bar area */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="font-[Geist_Mono] text-sm font-bold text-gray-700">
                            {diplomaTitle} - {examTitle}
                        </p>
                        <p className="font-[Geist_Mono] text-sm text-gray-700">
                            Question <span className="font-bold text-[#155DFC]">{total}</span> of {total}
                        </p>
                    </div>
                    <div className="mt-2 h-[16px] w-full overflow-hidden bg-blue-50">
                        <div className="h-full w-full bg-[#155DFC]" />
                    </div>
                </div>
            </div>

            {/* Results title */}
            <h2 className="font-[Geist_Mono] text-lg font-bold text-[#155DFC]">Results:</h2>

            {/* Content: Chart + Questions */}
            <div className="flex flex-col gap-4 lg:flex-row">
                {/* Left: Donut chart */}
                <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 bg-[#EFF6FF] p-8 lg:w-[350px] lg:shrink-0">
                    <svg width="203" height="203" viewBox="0 0 203 203">
                        <circle cx={chartCenter} cy={chartCenter} r={chartRadius} fill="none" stroke="#e5e7eb" strokeWidth={strokeW} />
                        <circle
                            cx={chartCenter} cy={chartCenter} r={chartRadius} fill="none"
                            stroke="#00BC7D" strokeWidth={strokeW}
                            strokeDasharray={`${correctStroke} ${circumference}`}
                            strokeDashoffset="0"
                            transform={`rotate(-90 ${chartCenter} ${chartCenter})`}
                        />
                        {wrong > 0 && (
                            <circle
                                cx={chartCenter} cy={chartCenter} r={chartRadius} fill="none"
                                stroke="#ef4444" strokeWidth={strokeW}
                                strokeDasharray={`${wrongStroke} ${circumference}`}
                                strokeDashoffset={`-${correctStroke}`}
                                transform={`rotate(-90 ${chartCenter} ${chartCenter})`}
                            />
                        )}
                    </svg>
                    {/* Legend */}
                    <div className="mt-6 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-[#00BC7D]" />
                            <span className="font-[Geist_Mono] text-sm text-gray-700">Correct: {correct}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-red-500" />
                            <span className="font-[Geist_Mono] text-sm text-gray-700">Incorrect: {wrong}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Questions review */}
                <div className="max-h-[400px] flex-1 overflow-y-auto border border-dashed border-gray-300 bg-white p-4">
                    <div className="flex flex-col gap-4">
                        {analytics && analytics.length > 0 ? (
                            analytics.map((item) => (
                                <div key={item.questionId} className="flex flex-col gap-2">
                                    <p className="font-[Geist_Mono] text-sm font-bold text-[#155DFC]">
                                        {item.questionText}
                                    </p>
                                    <AnswerRow
                                        text={item.selectedAnswer?.text || 'No answer'}
                                        variant={item.isCorrect ? 'correct' : 'incorrect'}
                                    />
                                    {!item.isCorrect && item.correctAnswer && (
                                        <AnswerRow
                                            text={item.correctAnswer.text}
                                            variant="correct-unselected"
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            questions.map((question) => {
                                const answerOptions = question.answers ?? [];
                                const userAnswer = userAnswers[question.id];
                                const correctAnswer = answerOptions.find(a => a.isCorrect);
                                const isCorrect = userAnswer === correctAnswer?.id;
                                const selectedAnswer = answerOptions.find(a => a.id === userAnswer);

                                return (
                                    <div key={question.id} className="flex flex-col gap-2">
                                        <p className="font-[Geist_Mono] text-sm font-bold text-[#155DFC]">
                                            {question.text}
                                        </p>
                                        <AnswerRow
                                            text={selectedAnswer?.text || 'No answer'}
                                            variant={isCorrect ? 'correct' : 'incorrect'}
                                        />
                                        {!isCorrect && correctAnswer && (
                                            <AnswerRow
                                                text={correctAnswer.text}
                                                variant="correct-unselected"
                                            />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate(`/dashboard/exams/${examId}/quiz`, { replace: true })}
                    className="flex flex-1 items-center justify-center gap-2 border border-gray-200 bg-gray-50 py-3 font-[Geist_Mono] text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                    <RotateCcw className="h-4 w-4" />
                    Restart
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/dashboard/diplomas', { replace: true })}
                    className="flex flex-1 items-center justify-center gap-2 bg-[#155DFC] py-3 font-[Geist_Mono] text-sm font-medium text-white hover:bg-blue-700"
                >
                    <img src={folderSearchIcon} alt="" className="h-4 w-4" />
                    Explore
                </button>
            </div>
        </div>
    );
}
