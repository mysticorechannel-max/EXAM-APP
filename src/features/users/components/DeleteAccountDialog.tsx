import { AlertTriangle } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-[400px] rounded-xl bg-white p-6 shadow-xl">
                {/* Warning icon */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-6 w-6 text-[#DC2626]" />
                </div>

                {/* Text */}
                <p className="text-center font-[Geist_Mono] text-[13px] text-gray-700 xl:text-[14px]">
                    Are you sure you want to delete your account? This action is permanent and cannot be undone.
                </p>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleteAccountMutation.isPending}
                        className={cn(
                            'h-[40px] flex-1 rounded-lg border border-gray-300 font-[Geist_Mono] text-[13px] font-medium text-gray-700 xl:h-[46px] xl:text-[14px]',
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
                            'h-[40px] flex-1 rounded-lg bg-[#DC2626] font-[Geist_Mono] text-[13px] font-medium text-white xl:h-[46px] xl:text-[14px]',
                            'flex items-center justify-center',
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
