import { useState, type FormEvent } from 'react';
import { useCreateDiploma, useUpdateDiploma } from '../hooks/useAdminDiplomaMutations';
import type { Diploma } from '@/features/diplomas/types/diploma.types';
import xIcon from '../../../lucideAdmin/x.svg';
import saveIcon from '../../../lucideAdmin/save.svg';

interface AdminDiplomaFormModalProps {
    diploma?: Diploma;
    onClose: () => void;
}

export function AdminDiplomaFormModal({ diploma, onClose }: AdminDiplomaFormModalProps) {
    const isEdit = !!diploma;
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
                {
                    onSuccess: () => onClose(),
                    onError: (err) => setError((err as { message?: string }).message || 'Failed to update'),
                }
            );
        } else {
            createMutation.mutate(body, {
                onSuccess: () => onClose(),
                onError: (err) => setError((err as { message?: string }).message || 'Failed to create'),
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50">
            <div className="mt-10 flex w-full max-w-[1078px] flex-col bg-[#F3F4F6]">
                {/* Header — 72px, border-top 1px, padding 6px 24px */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-[6px]" style={{ minHeight: '72px' }}>
                    <span className="font-[Geist_Mono] text-sm text-gray-400">
                        Diplomas / <span className="text-[#155DFC]">{isEdit ? diploma.title : 'Add New Diploma'}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-[36px] items-center gap-2 border border-gray-300 bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <img src={xIcon} alt="" className="h-4 w-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="diploma-form"
                            disabled={isPending}
                            className="flex h-[36px] items-center gap-2 bg-[#155DFC] px-4 font-[Geist_Mono] text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            <img src={saveIcon} alt="" className="h-4 w-4" />
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Main content — padding 24px, gap 24px, bg gray-100 */}
                <form id="diploma-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
                    {error && (
                        <p className="font-[Geist_Mono] text-sm text-red-600">{error}</p>
                    )}

                    {/* Diploma Information header */}
                    <div className="bg-[#155DFC] px-4 py-2">
                        <span className="font-[Geist_Mono] text-sm font-medium text-white">Diploma Information</span>
                    </div>

                    {/* Image field */}
                    <div className="flex flex-col gap-2 bg-white p-4">
                        <label className="font-[Geist_Mono] text-sm text-gray-700">Image</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Drop an image here or select from your computer"
                            className="h-[46px] w-full border border-[#E5E7EB] bg-white px-3 font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Title field */}
                    <div className="flex flex-col gap-2 bg-white p-4">
                        <label className="font-[Geist_Mono] text-sm text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-[46px] w-full border border-[#E5E7EB] bg-white px-3 font-[Geist_Mono] text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Description field */}
                    <div className="flex flex-col gap-2 bg-white p-4">
                        <label className="font-[Geist_Mono] text-sm text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full resize-none border border-[#E5E7EB] bg-white px-3 py-3 font-[Geist_Mono] text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
