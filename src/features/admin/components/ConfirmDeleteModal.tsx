import { X } from 'lucide-react';

interface ConfirmDeleteModalProps {
    title: string;
    isLoading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export function ConfirmDeleteModal({ title, isLoading, onConfirm, onClose }: ConfirmDeleteModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-[400px] bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="font-[Geist_Mono] text-lg font-bold text-gray-800">
                        Confirm Delete
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
                <div className="px-6 py-5">
                    <p className="font-[Geist_Mono] text-sm text-gray-700">
                        Are you sure you want to delete <strong>&ldquo;{title}&rdquo;</strong>? This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-gray-300 px-4 py-2 font-[Geist_Mono] text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-[#DC2626] px-5 py-2 font-[Geist_Mono] text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
