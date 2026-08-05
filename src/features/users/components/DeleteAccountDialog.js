import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
export function DeleteAccountDialog({ open, onClose }) {
    const deleteAccountMutation = useDeleteAccount();
    if (!open)
        return null;
    const handleDelete = () => {
        deleteAccountMutation.mutate();
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/50", onClick: onClose }), _jsxs("div", { className: "relative z-10 w-full max-w-[400px] rounded-xl bg-white p-6 shadow-xl", children: [_jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50", children: _jsx(AlertTriangle, { className: "h-6 w-6 text-[#DC2626]" }) }), _jsx("p", { className: "text-center font-[Geist_Mono] text-[13px] text-gray-700 xl:text-[14px]", children: "Are you sure you want to delete your account? This action is permanent and cannot be undone." }), _jsxs("div", { className: "mt-6 flex gap-3", children: [_jsx("button", { type: "button", onClick: onClose, disabled: deleteAccountMutation.isPending, className: cn('h-[40px] flex-1 rounded-lg border border-gray-300 font-[Geist_Mono] text-[13px] font-medium text-gray-700 xl:h-[46px] xl:text-[14px]', 'hover:bg-gray-50 transition-colors', 'disabled:opacity-70 disabled:cursor-not-allowed'), children: "Cancel" }), _jsx("button", { type: "button", onClick: handleDelete, disabled: deleteAccountMutation.isPending, className: cn('h-[40px] flex-1 rounded-lg bg-[#DC2626] font-[Geist_Mono] text-[13px] font-medium text-white xl:h-[46px] xl:text-[14px]', 'flex items-center justify-center', 'hover:bg-[#B91C1C] transition-colors', 'disabled:opacity-70 disabled:cursor-not-allowed'), children: deleteAccountMutation.isPending ? (_jsx(Spinner, { size: "sm", className: "text-white" })) : ('Yes, delete') })] })] })] }));
}
