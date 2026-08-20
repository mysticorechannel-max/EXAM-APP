import { useState, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDiplomaDetails } from '@/features/diplomas/hooks/useDiplomaDetails';
import { useCreateDiploma, useUpdateDiploma } from '../hooks/useAdminDiplomaMutations';
import xIcon from '@/assets/icons/admin/x.svg';
import saveIcon from '@/assets/icons/admin/save.svg';
import fileImageIcon from '@/assets/icons/admin/file-image.svg';
import cloudUploadIcon from '@/assets/icons/admin/cloud-upload.svg';

export function AdminDiplomaFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: existingDiploma, isLoading: loadingDiploma } = useDiplomaDetails(id ?? '');

    if (isEdit && loadingDiploma) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin border-2 border-gray-300 border-t-[#155DFC]" />
            </div>
        );
    }

    return (
        <DiplomaForm
            diploma={isEdit ? existingDiploma : undefined}
            isEdit={isEdit}
            onCancel={() => navigate(isEdit && id ? `/admin/diplomas/${id}` : '/admin/diplomas')}
            onSuccess={() => navigate(isEdit && id ? `/admin/diplomas/${id}` : '/admin/diplomas')}
        />
    );
}

interface DiplomaFormProps {
    diploma?: { id: string; title: string; description: string | null; image: string | null };
    isEdit: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

function DiplomaForm({ diploma, isEdit, onCancel, onSuccess }: DiplomaFormProps) {
    const [title, setTitle] = useState(diploma?.title ?? '');
    const [description, setDescription] = useState(diploma?.description ?? '');
    const [image, setImage] = useState(diploma?.image ?? '');
    const [error, setError] = useState('');

    const createMutation = useCreateDiploma();
    const updateMutation = useUpdateDiploma();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        const body = {
            title: title.trim(),
            ...(description.trim() && { description: description.trim() }),
            ...(image.trim() && { image: image.trim() }),
        };

        if (isEdit && diploma) {
            updateMutation.mutate(
                { id: diploma.id, body },
                { onSuccess, onError: (err) => setError((err as { message?: string }).message || 'Failed') }
            );
        } else {
            createMutation.mutate(body, {
                onSuccess,
                onError: (err) => setError((err as { message?: string }).message || 'Failed'),
            });
        }
    };

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-6 py-3">
                <span className="font-[Geist_Mono] text-sm text-gray-400">
                    <Link to="/admin/diplomas" className="hover:text-gray-300">Diplomas</Link>
                    {' / '}
                    <span className="text-[#155DFC]">{isEdit ? diploma?.title : 'Add New Diploma'}</span>
                </span>
            </div>

            {/* Header — 72px, border-top 1px, padding 6px 24px, space-between */}
            <div className="flex items-center justify-end gap-[10px] border-t border-gray-200 bg-white px-6 py-[6px]" style={{ minHeight: '72px' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-[40px] items-center gap-[10px] border border-gray-300 bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50"
                >
                    <img src={xIcon} alt="" className="h-4 w-4" />
                    Cancel
                </button>
                <button
                    type="submit"
                    form="diploma-form"
                    disabled={isPending}
                    className="flex h-[40px] items-center gap-[10px] bg-[#00BC7D] px-4 font-[Geist_Mono] text-sm font-medium text-white hover:bg-[#00a86f] disabled:opacity-60"
                >
                    <img src={saveIcon} alt="" className="h-4 w-4" />
                    {isPending ? 'Saving...' : 'Save'}
                </button>
            </div>

            {/* Main Content — bg #F3F4F6, padding 24px, gap 24px */}
            <div className="bg-[#F3F4F6] p-6">
                <form id="diploma-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && <p className="font-[Geist_Mono] text-sm text-red-600">{error}</p>}

                    {/* Diploma Information header */}
                    <div className="bg-[#155DFC] px-4 py-2">
                        <span className="font-[Geist_Mono] text-sm font-medium text-white">Diploma Information</span>
                    </div>

                    {/* Form fields — all in one white box */}
                    <div className="flex flex-col bg-white">
                        {/* Image */}
                        <div className="flex flex-col gap-2 p-4">
                            <label className="font-[Geist_Mono] text-base font-medium text-gray-700">Image</label>
                            <div className="flex items-center gap-4 border border-[#E5E7EB] bg-white px-6 py-8">
                                <img src={fileImageIcon} alt="" className="h-10 w-10" />
                                <div className="flex flex-1 items-center justify-center gap-2">
                                    <img src={cloudUploadIcon} alt="" className="h-5 w-5" />
                                    <span className="font-[Geist_Mono] text-sm text-gray-500">
                                        Drop an image here or <span className="text-[#155DFC]">select from your computer</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="flex flex-col gap-2 p-4">
                            <label className="font-[Geist_Mono] text-base font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-[46px] w-full border border-[#E5E7EB] bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2 p-4">
                            <label className="font-[Geist_Mono] text-base font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="w-full resize-none border border-[#E5E7EB] bg-white px-4 py-3 font-[Geist_Mono] text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
