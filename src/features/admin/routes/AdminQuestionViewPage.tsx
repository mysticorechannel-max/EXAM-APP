import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuestions } from '@/features/questions/hooks/useQuestions';
import { useExamDetails } from '@/features/exams/hooks/useExamDetails';
import { useDeleteQuestion, useToggleQuestionImmutable } from '@/features/questions/hooks/useQuestionMutations';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { isSuperAdmin } from '@/shared/utils';
import banIcon from '@/assets/icons/admin/ban.svg';
import penLineIcon from '@/assets/icons/admin/pen-line.svg';
import trash2Icon from '@/assets/icons/admin/trash-2.svg';

export function AdminQuestionViewPage() {
    const { examId, questionId } = useParams<{ examId: string; questionId: string }>();
    const navigate = useNavigate();
    const { data: questions = [], isLoading } = useQuestions(examId ?? '');
    const { data: exam } = useExamDetails(examId ?? '');
    const deleteMutation = useDeleteQuestion();
    const immutableMutation = useToggleQuestionImmutable();

    const [deleteModal, setDeleteModal] = useState(false);

    const question = questions.find(q => q.id === questionId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin border-2 border-gray-300 border-t-[#155DFC]" />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="font-[Geist_Mono] text-sm text-gray-600">Question not found.</p>
                <Link to={`/admin/exams/${examId}`} className="mt-3 font-[Geist_Mono] text-sm text-[#155DFC]">
                    Back to Exam
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        deleteMutation.mutate(question.id, {
            onSuccess: () => navigate(`/admin/exams/${examId}`),
        });
    };

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-6 py-3">
                <span className="font-[Geist_Mono] text-sm text-gray-400">
                    <Link to="/admin/exams" className="hover:text-gray-300">Exams</Link>
                    {' / '}
                    <Link to={`/admin/exams/${examId}`} className="hover:text-gray-300">{exam?.title || '...'}</Link>
                    {' / '}
                    <span className="text-gray-400">Questions</span>
                    {' / '}
                    <span className="text-[#155DFC]">{question.text}</span>
                </span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-[6px]" style={{ minHeight: '72px' }}>
                <div>
                    <h1 className="font-[Inter] text-[18px] font-semibold text-gray-900">
                        {question.text}
                    </h1>
                    {exam && (
                        <span className="font-[Geist_Mono] text-xs text-gray-500">
                            Exam: <Link to={`/admin/exams/${examId}`} className="text-[#155DFC] underline hover:text-blue-700">{exam.title} ↗</Link>
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {isSuperAdmin() && (
                        <button
                            type="button"
                            onClick={() => immutableMutation.mutate({ id: question.id, immutable: true })}
                            disabled={immutableMutation.isPending}
                            className="flex h-[36px] cursor-pointer items-center gap-2 border border-gray-300 bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <img src={banIcon} alt="" className="h-4 w-4" />
                            Immutable
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/exams/${examId}/questions/${questionId}/edit`)}
                        className="flex h-[36px] cursor-pointer items-center gap-2 bg-[#155DFC] px-4 font-[Geist_Mono] text-sm text-white hover:bg-blue-700"
                    >
                        <img src={penLineIcon} alt="" className="h-4 w-4" />
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeleteModal(true)}
                        className="flex h-[36px] cursor-pointer items-center gap-2 bg-[#DC2626] px-4 font-[Geist_Mono] text-sm text-white hover:bg-red-700"
                    >
                        <img src={trash2Icon} alt="" className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="border-t border-gray-200 bg-white px-6 py-6">
                {/* Headline */}
                <div className="mb-6">
                    <p className="mb-1 font-[Geist_Mono] text-xs text-gray-400">Headline</p>
                    <p className="font-[Geist_Mono] text-sm text-gray-800">{question.text}</p>
                </div>

                {/* Exam */}
                <div className="mb-6">
                    <p className="mb-1 font-[Geist_Mono] text-xs text-gray-400">Exam</p>
                    {exam ? (
                        <Link to={`/admin/exams/${examId}`} className="font-[Geist_Mono] text-sm text-gray-800 hover:text-[#155DFC]">
                            {exam.title} ↗
                        </Link>
                    ) : (
                        <p className="font-[Geist_Mono] text-sm text-gray-800">—</p>
                    )}
                </div>

                {/* Answers */}
                <div className="mb-6">
                    <p className="mb-1 font-[Geist_Mono] text-xs text-gray-400">Answers</p>
                    <p className="font-[Geist_Mono] text-sm font-semibold text-gray-800">{question.answers?.length || 0}</p>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteModal && (
                <ConfirmDeleteModal
                    title={question.text}
                    isLoading={deleteMutation.isPending}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteModal(false)}
                />
            )}
        </div>
    );
}
