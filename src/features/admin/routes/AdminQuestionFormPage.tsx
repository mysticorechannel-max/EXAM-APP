import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAdminExams } from '../hooks/useAdminExams';
import { useQuestions } from '@/features/questions/hooks/useQuestions';
import { useCreateQuestion, useUpdateQuestion } from '@/features/questions/hooks/useQuestionMutations';
import chevronsUpDown from '@/assets/icons/admin/chevrons-up-down.svg';
import saveIcon from '@/assets/icons/admin/save.svg';
import xIcon from '@/assets/icons/admin/x.svg';
import copyPlusIcon from '@/assets/icons/admin/copy-plus.svg';
import trash2RedIcon from '@/assets/icons/admin/trash-2-red.svg';


export function AdminQuestionFormPage() {
    const { examId, questionId } = useParams<{ examId: string; questionId: string }>();
    const navigate = useNavigate();
    const isEdit = !!questionId;

    const { data: examsData } = useAdminExams({ page: 1, limit: 100 });
    const exams = examsData?.data ?? [];
    const { data: questions = [] } = useQuestions(examId ?? '');
    const existingQuestion = isEdit ? questions.find(q => q.id === questionId) : undefined;

    const createMutation = useCreateQuestion();
    const updateMutation = useUpdateQuestion();

    const [selectedExamId, setSelectedExamId] = useState(examId || '');
    const [headline, setHeadline] = useState('');
    const [answers, setAnswers] = useState<{ text: string; isCorrect: boolean }[]>([]);
    const [newAnswerText, setNewAnswerText] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingQuestion && isEdit) {
            setHeadline(existingQuestion.text);
            setAnswers(existingQuestion.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect })));
        }
    }, [existingQuestion, isEdit]);

    useEffect(() => {
        if (examId) setSelectedExamId(examId);
    }, [examId]);

    const handleSave = () => {
        setError('');
        if (!headline.trim()) { setError('Question headline is required'); return; }
        if (!selectedExamId) { setError('Please select an exam'); return; }
        if (answers.length < 2) { setError('At least 2 answers required'); return; }
        if (!answers.some(a => a.isCorrect)) { setError('Please mark one answer as correct'); return; }

        if (isEdit && questionId) {
            updateMutation.mutate(
                { id: questionId, body: { text: headline.trim(), answers } },
                {
                    onSuccess: () => navigate(`/admin/exams/${selectedExamId}/questions/${questionId}`),
                    onError: (err: unknown) => setError((err as { message?: string }).message || 'Failed to update'),
                }
            );
        } else {
            createMutation.mutate(
                { text: headline.trim(), examId: selectedExamId, answers },
                {
                    onSuccess: () => navigate(`/admin/exams/${selectedExamId}`),
                    onError: (err: unknown) => setError((err as { message?: string }).message || 'Failed to create'),
                }
            );
        }
    };

    const handleAddAnswer = () => {
        if (!newAnswerText.trim()) return;
        setAnswers([...answers, { text: newAnswerText.trim(), isCorrect: false }]);
        setNewAnswerText('');
    };

    const handleRemoveAnswer = (idx: number) => {
        setAnswers(answers.filter((_, i) => i !== idx));
    };

    const handleMarkCorrect = (idx: number) => {
        setAnswers(answers.map((a, i) => ({ ...a, isCorrect: i === idx })));
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-6 py-3">
                <span className="font-[Geist_Mono] text-sm text-gray-400">
                    <Link to="/admin/exams" className="hover:text-gray-300">Exams</Link>
                    {' / '}
                    <span className="text-[#155DFC]">{isEdit ? 'Edit Question' : 'Create New Question'}</span>
                </span>
            </div>

            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-3">
                <button
                    type="button"
                    onClick={() => navigate(examId ? `/admin/exams/${examId}/questions/bulk-add` : '/admin/exams')}
                    className="flex h-[40px] items-center gap-2 border border-[#E5E7EB] bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50"
                >
                    <img src={copyPlusIcon} alt="" className="h-[18px] w-[18px]" />
                    Bulk Add Mode
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(examId ? `/admin/exams/${examId}` : '/admin/exams')}
                        className="flex h-[40px] items-center gap-2 border border-[#E5E7EB] bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <img src={xIcon} alt="" className="h-4 w-4" />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex h-[40px] items-center gap-2 bg-[#00BC7D] px-4 font-[Geist_Mono] text-sm text-white hover:bg-[#00a86f] disabled:opacity-50"
                    >
                        <img src={saveIcon} alt="" className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="px-6 py-2">
                    <p className="font-[Geist_Mono] text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Question Information */}
            <div className="bg-[#155DFC] px-[10px] py-2">
                <span className="font-[Geist_Mono] text-sm font-semibold text-white">Question Information</span>
            </div>

            <div className="bg-white px-6 py-6">
                {/* Exam select */}
                <div className="mb-6">
                    <label className="mb-2 block font-[Geist_Mono] text-sm font-semibold text-gray-800">Exam</label>
                    <div className="relative">
                        <select
                            value={selectedExamId}
                            onChange={(e) => setSelectedExamId(e.target.value)}
                            className="h-[46px] w-full appearance-none border border-[#E5E7EB] bg-white py-[10px] pr-[40px] pl-[10px] font-[Geist_Mono] text-sm text-gray-500 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select exam</option>
                            {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
                        </select>
                        <img src={chevronsUpDown} alt="" className="pointer-events-none absolute top-1/2 right-[10px] h-5 w-5 -translate-y-1/2" />
                    </div>
                </div>

                {/* Question Headline */}
                <div>
                    <label className="mb-2 block font-[Geist_Mono] text-sm font-semibold text-gray-800">Question Headline</label>
                    <textarea
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        rows={3}
                        className="w-full border border-[#E5E7EB] bg-white px-[10px] py-[10px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Question Answers */}
            <div className="mt-4 bg-[#155DFC] px-[10px] py-2">
                <span className="font-[Geist_Mono] text-sm font-semibold text-white">Question Answers</span>
            </div>

            {/* Answers header */}
            <div className="grid grid-cols-[1fr_auto] items-center bg-white px-[10px] py-2 border-b border-gray-200">
                <span className="font-[Geist_Mono] text-sm font-semibold text-gray-700">Body</span>
                <button
                    type="button"
                    onClick={() => { if (newAnswerText.trim()) handleAddAnswer(); }}
                    className="flex h-[32px] items-center gap-1 bg-[#00BC7D] px-4 font-[Geist_Mono] text-sm text-white hover:bg-[#00a86f]"
                >
                    <Plus className="h-4 w-4" />
                    Add Answer
                </button>
            </div>

            {/* Answers list */}
            <div className="bg-white">
                {answers.map((answer, idx) => (
                    <div key={idx} className="flex items-stretch border-b border-gray-200">
                        <div className="flex w-[48px] flex-shrink-0 items-center justify-center bg-[#FEF2F2]">
                            <button
                                type="button"
                                onClick={() => handleRemoveAnswer(idx)}
                                className="flex h-full w-full items-center justify-center hover:opacity-80"
                                aria-label="Delete answer"
                            >
                                <img src={trash2RedIcon} alt="" className="h-[18px] w-[18px]" />
                            </button>
                        </div>
                        <div className="flex flex-1 items-center px-[10px] py-3">
                            <span className="flex-1 font-[Geist_Mono] text-[14px] font-medium text-gray-800">{answer.text}</span>
                            {answer.isCorrect ? (
                                <span className="flex-shrink-0 font-[Geist_Mono] text-sm font-semibold text-[#00BC7D]">
                                    ✓✓ Correct Answer
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleMarkCorrect(idx)}
                                    className="flex h-[32px] flex-shrink-0 items-center gap-1 bg-[#E5E7EB] px-3 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-300"
                                >
                                    ✓ Mark Correct
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* New answer input row */}
                <div className="flex items-stretch bg-[#F0FDF4]">
                    <div className="flex w-[48px] flex-shrink-0 items-center justify-center bg-[#F0FDF4]">
                        <button
                            type="button"
                            onClick={() => setNewAnswerText('')}
                            className="icon-circle flex h-[28px] w-[28px] items-center justify-center border border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-gray-50"
                            aria-label="Clear answer"
                        >
                            <span className="text-[16px] leading-none">×</span>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center px-[10px] py-3">
                        <input
                            type="text"
                            value={newAnswerText}
                            onChange={(e) => setNewAnswerText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddAnswer(); }}
                            placeholder="Enter answer body"
                            className="h-[40px] flex-1 border border-[#00BC7D] bg-[#F0FDF4] px-[10px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#00BC7D] focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddAnswer}
                            disabled={!newAnswerText.trim()}
                            className="ml-3 flex h-[36px] flex-shrink-0 items-center gap-1 bg-[#00BC7D] px-5 font-[Geist_Mono] text-sm text-white hover:bg-[#00a86f] disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
