import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { isApiError } from '@/shared/api';
import { useChangePassword } from '../hooks/useChangePassword';
import { changePasswordSchema, } from '../schemas/change-password.schema';
export function ChangePasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const changePasswordMutation = useChangePassword();
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });
    const onSubmit = (data) => {
        changePasswordMutation.reset();
        changePasswordMutation.mutate(data, {
            onSuccess: () => {
                toast.success('Your password has been updated.');
                reset();
            },
        });
    };
    const apiErrorMessage = changePasswordMutation.error
        ? isApiError(changePasswordMutation.error)
            ? changePasswordMutation.error.message
            : 'Something went wrong'
        : null;
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4 xl:gap-5", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: "currentPassword", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: "Current Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "currentPassword", type: showCurrentPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register('currentPassword'), className: cn('h-[40px] w-full rounded-lg border p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.currentPassword ? 'border-destructive' : 'border-input'), disabled: changePasswordMutation.isPending }), _jsx("button", { type: "button", onClick: () => setShowCurrentPassword(!showCurrentPassword), className: "absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "aria-label": showCurrentPassword ? 'Hide password' : 'Show password', children: showCurrentPassword ? (_jsx(EyeOff, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" })) : (_jsx(Eye, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" })) })] }), errors.currentPassword && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.currentPassword.message }))] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: "newPassword", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: "New Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "newPassword", type: showNewPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register('newPassword'), className: cn('h-[40px] w-full rounded-lg border p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.newPassword ? 'border-destructive' : 'border-input'), disabled: changePasswordMutation.isPending }), _jsx("button", { type: "button", onClick: () => setShowNewPassword(!showNewPassword), className: "absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "aria-label": showNewPassword ? 'Hide password' : 'Show password', children: showNewPassword ? (_jsx(EyeOff, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" })) : (_jsx(Eye, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" })) })] }), errors.newPassword && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.newPassword.message }))] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: "confirmPassword", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: "Confirm New Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "confirmPassword", type: showConfirmPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register('confirmPassword'), className: cn('h-[40px] w-full rounded-lg border p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.confirmPassword ? 'border-destructive' : 'border-input'), disabled: changePasswordMutation.isPending }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "aria-label": showConfirmPassword ? 'Hide password' : 'Show password', children: showConfirmPassword ? (_jsx(EyeOff, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" })) : (_jsx(Eye, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" })) })] }), errors.confirmPassword && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.confirmPassword.message }))] }), apiErrorMessage && (_jsxs("div", { className: "relative rounded-lg border border-[#DC2626] bg-white px-4 pt-5 pb-3", children: [_jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DC2626]", children: _jsx(AlertCircle, { className: "h-3.5 w-3.5 text-[#DC2626]" }) }), _jsx("p", { className: "text-center font-[Geist_Mono] text-[12px] font-medium text-[#DC2626] xl:text-[13px]", children: apiErrorMessage })] })), _jsx("button", { type: "submit", disabled: changePasswordMutation.isPending, className: cn('h-[46px] w-full rounded-lg bg-[#155DFC] font-[Geist_Mono] text-[14px] font-medium text-white', 'flex items-center justify-center', 'hover:bg-[#1250D4] transition-colors', 'disabled:opacity-70 disabled:cursor-not-allowed'), children: changePasswordMutation.isPending ? (_jsx(Spinner, { size: "sm", className: "text-white" })) : ('Update Password') })] }));
}
