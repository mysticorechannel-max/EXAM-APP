import { X, TriangleAlert } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { useDeleteAccount } from '../hooks/useDeleteAccount';

interface DeleteAccountDialogProps {
    open: boolean;
    onClose: () => void;
}

export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
    const deleteAccountMutation = useDeleteAccount();

    if (!open) return null;

    const handleDelete = () => {
        deleteAccountMutation.mutate();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative z-10 w-full max-w-[460px] bg-white shadow-xl">
                {/* Close button */}
                <div className="flex justify-end px-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Warning icon with pink circular background */}
                <div className="flex justify-center pb-6">
                    <div className="relative flex h-[110px] w-[110px] items-center justify-center">
                        <div className="icon-circle absolute h-[110px] w-[110px] bg-[#FEF2F2]" />
                        <div className="icon-circle absolute h-[80px] w-[80px] bg-[#FEE2E2]" />
                        <div className="icon-circle absolute h-[56px] w-[56px] bg-[#FECACA]" />
                        <TriangleAlert className="relative z-10 h-[50px] w-[50px] text-[#DC2626]" strokeWidth={2} />
                    </div>
                </div>

                {/* Text */}
                <div className="px-8 pb-6 text-center">
                    <p className="font-[Geist_Mono] text-[16px] font-semibold text-[#DC2626]">
                        Are you sure you want to delete your account?
                    </p>
                    <p className="mt-2 font-[Geist_Mono] text-[14px] font-normal text-gray-500">
                        This action is permanent and cannot be undone.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 border-t border-gray-200 px-8 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleteAccountMutation.isPending}
                        className={cn(
                            'flex h-[40px] flex-1 items-center justify-center border border-gray-300 font-[Geist_Mono] text-[14px] font-medium text-gray-700',
                            'hover:bg-gray-50 transition-colors',
                            'disabled:opacity-70 disabled:cursor-not-allowed'
                        )}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteAccountMutation.isPending}
                        className={cn(
                            'flex h-[40px] flex-1 items-center justify-center bg-[#DC2626] font-[Geist_Mono] text-[14px] font-medium text-white',
                            'hover:bg-[#B91C1C] transition-colors',
                            'disabled:opacity-70 disabled:cursor-not-allowed'
                        )}
                    >
                        {deleteAccountMutation.isPending ? (
                            <Spinner size="sm" className="text-white" />
                        ) : (
                            'Yes, delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
