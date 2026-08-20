import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDiplomaDetails } from '@/features/diplomas/hooks/useDiplomaDetails';
import { useDeleteDiploma, useToggleDiplomaImmutable } from '../hooks/useAdminDiplomaMutations';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useState } from 'react';
import banIcon from '@/assets/icons/admin/ban.svg';
import penLineIcon from '@/assets/icons/admin/pen-line.svg';
import trash2Icon from '@/assets/icons/admin/trash-2.svg';

export function AdminDiplomaViewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: diploma, isLoading, isError } = useDiplomaDetails(id ?? '');
    const deleteMutation = useDeleteDiploma();
    const immutableMutation = useToggleDiplomaImmutable();

    const [deleteModal, setDeleteModal] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin border-2 border-gray-300 border-t-[#155DFC]" />
            </div>
        );
    }

    if (isError || !diploma) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="font-[Geist_Mono] text-sm text-gray-600">Diploma not found.</p>
                <Link to="/admin/diplomas" className="mt-3 font-[Geist_Mono] text-sm text-[#155DFC]">
                    Back to Diplomas
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        deleteMutation.mutate(diploma.id, {
            onSuccess: () => navigate('/admin/diplomas'),
        });
    };

    const handleToggleImmutable = () => {
        immutableMutation.mutate({ id: diploma.id, immutable: !diploma.immutable });
    };

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-6 py-3">
                <span className="font-[Geist_Mono] text-sm text-gray-400">
                    <Link to="/admin/diplomas" className="hover:text-gray-300">Diplomas</Link>
                    {' / '}
                    <span className="text-[#155DFC]">{diploma.title}</span>
                </span>
            </div>

            {/* Header — 72px, border-top 1px, padding 6px 24px, space-between */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-[6px]" style={{ minHeight: '72px' }}>
                <h1 className="font-[Inter] text-[18px] font-semibold text-gray-900">
                    {diploma.title}
                </h1>
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
                        onClick={() => navigate(`/admin/diplomas/${diploma.id}/edit`)}
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
                        {diploma.image ? (
                            <img src={diploma.image} alt={diploma.title} className="max-h-[300px] object-contain" />
                        ) : (
                            <div className="flex h-[200px] w-[200px] items-center justify-center bg-gray-100 font-[Geist_Mono] text-sm text-gray-400">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <p className="mb-1 font-[Geist_Mono] text-xs text-amber-500">Title</p>
                        <p className="font-[Geist_Mono] text-sm text-gray-800">{diploma.title}</p>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="mb-1 font-[Geist_Mono] text-xs text-amber-500">Description</p>
                        <p className="font-[Geist_Mono] text-sm text-gray-700 leading-relaxed">
                            {diploma.description || '—'}
                        </p>
                    </div>

                    {/* Bottom divider */}
                    <hr className="mt-6 border-gray-200" />
                </div>
            </div>

            {/* Modals */}
            {deleteModal && (
                <ConfirmDeleteModal
                    title={diploma.title}
                    isLoading={deleteMutation.isPending}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteModal(false)}
                />
            )}
        </div>
    );
}
