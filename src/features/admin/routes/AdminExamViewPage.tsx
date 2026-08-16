import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { useExamDetails } from '@/features/exams/hooks/useExamDetails';
import { useQuestions } from '@/features/questions/hooks/useQuestions';
import { useDeleteExam, useToggleExamImmutable } from '../hooks/useAdminExamMutations';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import banIcon from '../../../lucideAdmin/ban.svg';
import penLineIcon from '../../../lucideAdmin/pen-line.svg';
import trash2Icon from '../../../lucideAdmin/trash-2.svg';
import arrowDownWideNarrow from '../../../lucideAdmin/arrow-down-wide-narrow.svg';

export function AdminExamViewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: exam, isLoading, isError } = useExamDetails(id ?? '');
    const { data: questions = [] } = useQuestions(id ?? '');
    const deleteMutation = useDeleteExam();
    const immutableMutation = useToggleExamImmutable();

    const [deleteModal, setDeleteModal] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'text' | 'createdAt'>('text');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const sortedQuestions = useMemo(() => {
        return [...questions].sort((a, b) => {
            if (sortBy === 'text') {
                const cmp = a.text.localeCompare(b.text);
                return sortOrder === 'asc' ? cmp : -cmp;
            }
            const dateA = new Date(a.createdAt || '').getTime();
            const dateB = new Date(b.createdAt || '').getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [questions, sortBy, sortOrder]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin border-2 border-gray-300 border-t-[#155DFC]" />
            </div>
        );
    }

    if (isError || !exam) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="font-[Geist_Mono] text-sm text-gray-600">Exam not found.</p>
                <Link to="/admin/exams" className="mt-3 font-[Geist_Mono] text-sm text-[#155DFC]">
                    Back to Exams
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        deleteMutation.mutate(exam.id, {
            onSuccess: () => navigate('/admin/exams'),
        });
    };

    const handleToggleImmutable = () => {
        immutableMutation.mutate({ id: exam.id, immutable: !exam.immutable });
    };

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-6 py-3">
                <span className="font-[Geist_Mono] text-sm text-gray-400">
                    <Link to="/admin/exams" className="hover:text-gray-300">Exams</Link>
                    {' / '}
                    <span className="text-[#155DFC]">{exam.title}</span>
                </span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-[6px]" style={{ minHeight: '72px' }}>
                <div>
                    <h1 className="font-[Inter] text-[18px] font-semibold text-gray-900">
                        {exam.title}
                    </h1>
                    {exam.diploma && (
                        <span className="font-[Geist_Mono] text-xs text-gray-500">
                            Diploma: <Link to={`/admin/diplomas/${exam.diplomaId}`} className="text-[#155DFC] underline hover:text-blue-700">{exam.diploma.title} ↗</Link>
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleToggleImmutable}
                        disabled={immutableMutation.isPending}
                        className="flex h-[40px] items-center gap-[10px] border border-[#E5E7EB] bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <img src={banIcon} alt="" className="h-4 w-4" />
                        Immutable
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/exams/${exam.id}/edit`)}
                        className="flex h-[36px] items-center gap-2 bg-[#155DFC] px-4 font-[Geist_Mono] text-sm text-white hover:bg-blue-700"
                    >
                        <img src={penLineIcon} alt="" className="h-4 w-4" />
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeleteModal(true)}
                        className="flex h-[36px] items-center gap-2 bg-[#DC2626] px-4 font-[Geist_Mono] text-sm text-white hover:bg-red-700"
                    >
                        <img src={trash2Icon} alt="" className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-gray-200 bg-white px-6 py-6">
                <div className="border border-gray-200 rounded px-6 py-6">
                    {/* Image */}
                    <div className="mb-6">
                        <p className="mb-2 font-[Geist_Mono] text-xs text-amber-500">Image</p>
                        {exam.image ? (
                            <img src={exam.image} alt={exam.title} className="max-h-[300px] object-contain" />
                        ) : (
                            <div className="flex h-[200px] w-[200px] items-center justify-center bg-gray-100 font-[Geist_Mono] text-sm text-gray-400">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <p className="mb-1 font-[Geist_Mono] text-xs text-amber-500">Title</p>
                        <p className="font-[Geist_Mono] text-sm text-gray-800">{exam.title}</p>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <p className="mb-1 font-[Geist_Mono] text-xs text-amber-500">Description</p>
                        <p className="font-[Geist_Mono] text-sm leading-relaxed text-gray-700">
                            {exam.description || '—'}
                        </p>
                    </div>

                    {/* Diploma */}
                    <div className="mb-6">
                        <p className="mb-1 font-[Geist_Mono] text-xs text-amber-500">Diploma</p>
                        {exam.diploma ? (
                            <Link to={`/admin/diplomas/${exam.diplomaId}`} className="font-[Geist_Mono] text-sm text-gray-800 hover:text-[#155DFC]">
                                {exam.diploma.title} ↗
                            </Link>
                        ) : (
                            <p className="font-[Geist_Mono] text-sm text-gray-800">—</p>
                        )}
                    </div>

                    {/* Duration */}
                    <div className="mb-6">
                        <p className="mb-1 font-[Geist_Mono] text-xs text-amber-500">Duration</p>
                        <p className="font-[Geist_Mono] text-sm font-semibold text-gray-800">{exam.duration} Minutes</p>
                    </div>

                    {/* No. of Questions */}
                    <div className="mb-6">
                        <p className="mb-1 font-[Geist_Mono] text-xs text-amber-500">No. of Questions</p>
                        <p className="font-[Geist_Mono] text-sm font-semibold text-gray-800">{exam.questionsCount}</p>
                    </div>

                    {/* Bottom divider */}
                    <hr className="border-gray-200" />
                </div>
            </div>

            {/* Exam Questions Section */}
            <div className="mt-2">
                {/* Section header — blue */}
                <div className="flex items-center justify-between bg-[#155DFC] px-[10px] py-2">
                    <span className="font-[Geist_Mono] text-sm font-semibold text-white">Exam Questions</span>
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/exams/${exam.id}/questions/new`)}
                        className="font-[Geist_Mono] text-sm text-white hover:underline"
                    >
                        + Add Questions
                    </button>
                </div>

                {/* Questions table header */}
                <div className="grid grid-cols-[1fr_80px] items-center border-b border-gray-200 bg-gray-50 px-[10px] py-2">
                    <span className="font-[Geist_Mono] text-xs font-semibold text-gray-700">Title</span>
                    <div className="relative flex items-center justify-end gap-1">
                        <button
                            type="button"
                            onClick={() => setSortOpen(!sortOpen)}
                            className="flex items-center gap-1"
                        >
                            <span className="font-[Geist_Mono] text-[14px] font-medium text-gray-700">Sort</span>
                            <img src={arrowDownWideNarrow} alt="" className="h-[18px] w-[18px]" />
                        </button>
                        {sortOpen && (
                            <div className="absolute top-full right-0 z-20 mt-1 w-[220px] border border-gray-200 bg-white shadow-md">
                                <button
                                    type="button"
                                    onClick={() => { setSortBy('text'); setSortOrder('asc'); setSortOpen(false); }}
                                    className={`flex w-full items-center px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50 ${sortBy === 'text' && sortOrder === 'asc' ? 'bg-blue-50 font-medium' : ''}`}
                                >
                                    Title (A-Z)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSortBy('text'); setSortOrder('desc'); setSortOpen(false); }}
                                    className={`flex w-full items-center px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50 ${sortBy === 'text' && sortOrder === 'desc' ? 'bg-blue-50 font-medium' : ''}`}
                                >
                                    Title (Z-A)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSortBy('createdAt'); setSortOrder('desc'); setSortOpen(false); }}
                                    className={`flex w-full items-center px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50 ${sortBy === 'createdAt' && sortOrder === 'desc' ? 'bg-blue-50 font-medium' : ''}`}
                                >
                                    Newest first
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSortBy('createdAt'); setSortOrder('asc'); setSortOpen(false); }}
                                    className={`flex w-full items-center px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50 ${sortBy === 'createdAt' && sortOrder === 'asc' ? 'bg-blue-50 font-medium' : ''}`}
                                >
                                    Oldest first
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Questions list */}
                <div className="bg-white">
                    {sortedQuestions.length === 0 && (
                        <div className="flex items-center justify-center py-10">
                            <p className="font-[Geist_Mono] text-sm text-gray-500">No questions yet.</p>
                        </div>
                    )}
                    {sortedQuestions.map((question) => (
                        <div key={question.id} className="grid grid-cols-[1fr_80px] items-center border-b border-gray-200 px-[10px] py-3">
                            <span className="font-[Geist_Mono] text-[14px] font-medium text-gray-800">{question.text}</span>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/admin/exams/${exam.id}/questions/${question.id}`)}
                                    className="flex h-[30px] w-[30px] items-center justify-center border border-[#E5E7EB] bg-[#E5E7EB] text-gray-700 hover:text-gray-900"
                                    aria-label="View question"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Modal */}
            {deleteModal && (
                <ConfirmDeleteModal
                    title={exam.title}
                    isLoading={deleteMutation.isPending}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteModal(false)}
                />
            )}
        </div>
    );
}
