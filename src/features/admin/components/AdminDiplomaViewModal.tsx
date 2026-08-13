import { X } from 'lucide-react';
import type { Diploma } from '@/features/diplomas/types/diploma.types';

interface AdminDiplomaViewModalProps {
    diploma: Diploma;
    onClose: () => void;
}

export function AdminDiplomaViewModal({ diploma, onClose }: AdminDiplomaViewModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-[500px] bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="font-[Geist_Mono] text-lg font-bold text-gray-800">
                        Diploma Details
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 px-6 py-5">
                    {diploma.image && (
                        <div className="h-[200px] w-full overflow-hidden bg-gray-100">
                            <img
                                src={diploma.image}
                                alt={diploma.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <span className="font-[Geist_Mono] text-xs font-medium text-gray-500 uppercase">Title</span>
                        <span className="font-[Geist_Mono] text-sm text-gray-800">{diploma.title}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="font-[Geist_Mono] text-xs font-medium text-gray-500 uppercase">Description</span>
                        <span className="font-[Geist_Mono] text-sm text-gray-700">
                            {diploma.description || '—'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="font-[Geist_Mono] text-xs font-medium text-gray-500 uppercase">Immutable</span>
                            <span className="font-[Geist_Mono] text-sm text-gray-700">
                                {diploma.immutable ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-[Geist_Mono] text-xs font-medium text-gray-500 uppercase">Created</span>
                            <span className="font-[Geist_Mono] text-sm text-gray-700">
                                {new Date(diploma.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-800 px-5 py-2 font-[Geist_Mono] text-sm font-medium text-white hover:bg-gray-900"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
