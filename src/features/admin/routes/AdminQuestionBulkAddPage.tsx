import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAdminExams } from '../hooks/useAdminExams';
import { useCreateQuestion } from '@/features/questions/hooks/useQuestionMutations';
import chevronsUpDown from '../../../lucideAdmin/chevrons-up-down.svg';
import saveIcon from '../../../lucideAdmin/save.svg';
import xIcon from '../../../lucideAdmin/x.svg';
import copyPlusIcon from '../../../lucideAdmin/copy-plus.svg';
import trash2RedIcon from '../../../lucideAdmin/trash-2-red.svg';

interface QuestionTab {
    id: number;
    headline: string;
    answers: { text: string; isCorrect: boolean }[];
    newAnswerText: string;
}

function createEmptyQuestion(id: number): QuestionTab {
    return { id, headline: '', answers: [], newAnswerText: '' };
}

export function AdminQuestionBulkAddPage() {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

    const { data: examsData } = useAdminExams({ page: 1, limit: 100 });
    const exams = examsData?.data ?? [];
    const createMutation = useCreateQuestion();

    const [selectedExamId, setSelectedExamId] = useState(examId || '');
    const [questions, setQuestions] = useState<QuestionTab[]>([createEmptyQuestion(1)]);
    const [activeTab, setActiveTab] = useState(1);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (examId) setSelectedExamId(examId);
    }, [examId]);

    const activeQuestion = questions.find(q => q.id === activeTab)!;

    const updateActiveQuestion = (updates: Partial<QuestionTab>) => {
        setQuestions(prev => prev.map(q => q.id === activeTab ? { ...q, ...updates } : q));
    };

    const handleAddTab = () => {
        const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
        const newQuestion = createEmptyQuestion(newId);
        setQuestions([...questions, newQuestion]);
        setActiveTab(newId);
    };

    const handleRemoveTab = (id: number) => {
        if (questions.length <= 1) return;
        const filtered = questions.filter(q => q.id !== id);
        setQuestions(filtered);
        if (activeTab === id) {
            setActiveTab(filtered[0].id);
        }
    };

    const handleAddAnswer = () => {
        if (!activeQuestion.newAnswerText.trim()) return;
        updateActiveQuestion({
            answers: [...activeQuestion.answers, { text: activeQuestion.newAnswerText.trim(), isCorrect: false }],
            newAnswerText: '',
        });
    };

    const handleRemoveAnswer = (idx: number) => {
        updateActiveQuestion({
            answers: activeQuestion.answers.filter((_, i) => i !== idx),
        });
    };

    const handleMarkCorrect = (idx: number) => {
        updateActiveQuestion({
            answers: activeQuestion.answers.map((a, i) => ({ ...a, isCorrect: i === idx })),
        });
    };

    const handleSaveAll = async () => {
        setError('');
        if (!selectedExamId) { setError('Please select an exam first'); return; }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.headline.trim()) { setError(`Question Q${i + 1}: headline is required`); setActiveTab(q.id); return; }
            if (q.answers.length < 2) { setError(`Question Q${i + 1}: at least 2 answers required`); setActiveTab(q.id); return; }
            if (!q.answers.some(a => a.isCorrect)) { setError(`Question Q${i + 1}: mark one answer as correct`); setActiveTab(q.id); return; }
        }

        setIsSaving(true);
        try {
            for (const q of questions) {
                await createMutation.mutateAsync({
                    text: q.headline.trim(),
                    examId: selectedExamId,
                    answers: q.answers,
                });
            }
            navigate(examId ? `/admin/exams/${examId}` : '/admin/exams');
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e?.message || 'Failed to create questions');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-6 py-3">
                <span className="font-[Geist_Mono] text-sm text-gray-400">
                    <Link to="/admin/exams" className="hover:text-gray-300">Exams</Link>
                    {' / '}
                    <span className="text-[#155DFC]">Create New Question</span>
                </span>
            </div>

            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-3">
                <button
                    type="button"
                    className="flex h-[40px] items-center gap-2 bg-[#155DFC] px-4 font-[Geist_Mono] text-sm text-white"
                >
                    <img src={copyPlusIcon} alt="" className="h-[18px] w-[18px] brightness-0 invert" />
                    Bulk Add Mode
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(examId ? `/admin/exams/${examId}/questions/new` : '/admin/exams')}
                        className="flex h-[40px] items-center gap-2 border border-[#E5E7EB] bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <img src={xIcon} alt="" className="h-4 w-4" />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveAll}
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

            {/* Exam Info section */}
            <div className="bg-[#155DFC] px-[10px] py-2">
                <span className="font-[Geist_Mono] text-sm font-semibold text-white">Exam Info</span>
            </div>

            <div className="bg-white px-6 py-6">
                <div>
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
            </div>

            {/* Questions tabs section */}
            <div className="mt-4 bg-[#155DFC] px-[10px] py-2">
                <span className="font-[Geist_Mono] text-sm font-semibold text-white">Questions</span>
            </div>

            {/* Tabs row */}
            <div className="grid auto-cols-fr grid-flow-col border-b border-gray-200 bg-white">
                {questions.map((q, idx) => (
                    <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveTab(q.id)}
                        className={`relative flex items-center justify-center gap-1 border-r border-gray-200 py-3 font-[Geist_Mono] text-sm font-medium ${activeTab === q.id
                                ? 'text-[#155DFC] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#155DFC]'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Q{idx + 1}
                        {questions.length > 1 && (
                            <span
                                onClick={(e) => { e.stopPropagation(); handleRemoveTab(q.id); }}
                                className="absolute top-1 right-1 cursor-pointer text-[10px] text-red-400 hover:text-red-600"
                            >
                                ×
                            </span>
                        )}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={handleAddTab}
                    className="flex items-center justify-center border-r border-gray-200 py-3 text-gray-400 hover:text-gray-600"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Active question form */}
            <div className="bg-white px-6 py-6">
                <div>
                    <label className="mb-2 block font-[Geist_Mono] text-sm font-semibold text-gray-800">Question Headline</label>
                    <textarea
                        value={activeQuestion.headline}
                        onChange={(e) => updateActiveQuestion({ headline: e.target.value })}
                        rows={3}
                        className="w-full border border-[#E5E7EB] bg-white px-[10px] py-[10px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Answers header */}
            <div className="grid grid-cols-[1fr_auto] items-center bg-[#F9FAFB] px-[10px] py-2 border-b border-gray-200">
                <span className="font-[Geist_Mono] text-sm font-semibold text-gray-700">Body</span>
                <button
                    type="button"
                    onClick={() => { if (activeQuestion.newAnswerText.trim()) handleAddAnswer(); }}
                    className="flex h-[32px] items-center gap-1 bg-[#00BC7D] px-4 font-[Geist_Mono] text-sm text-white hover:bg-[#00a86f]"
                >
                    <Plus className="h-4 w-4" />
                    Add Answer
                </button>
            </div>

            {/* Answers list */}
            <div className="bg-white">
                {activeQuestion.answers.map((answer, idx) => (
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
                            onClick={() => updateActiveQuestion({ newAnswerText: '' })}
                            className="icon-circle flex h-[28px] w-[28px] items-center justify-center border border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-gray-50"
                            aria-label="Clear answer"
                        >
                            <span className="text-[16px] leading-none">×</span>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center px-[10px] py-3">
                        <input
                            type="text"
                            value={activeQuestion.newAnswerText}
                            onChange={(e) => updateActiveQuestion({ newAnswerText: e.target.value })}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddAnswer(); }}
                            placeholder="Enter answer body"
                            className="h-[40px] flex-1 border border-[#00BC7D] bg-[#F0FDF4] px-[10px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#00BC7D] focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddAnswer}
                            disabled={!activeQuestion.newAnswerText.trim()}
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
