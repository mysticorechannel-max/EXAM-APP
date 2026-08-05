import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { createPasswordSchema } from '../schemas/create-password.schema';
import { useCreatePasswordMutation } from '../hooks/useCreatePasswordMutation';
import { isApiError } from '@/shared/api';
import { ProgressStepper } from './ProgressStepper';
export function CreatePasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const mutation = useCreatePasswordMutation();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(createPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });
    const onSubmit = (data) => {
        mutation.reset();
        mutation.mutate(data);
    };
    const apiErrorMessage = mutation.error
        ? isApiError(mutation.error)
            ? mutation.error.message
            : 'Something went wrong'
        : null;
    return (_jsxs("div", { className: "w-full max-w-[380px] xl:max-w-[452px]", children: [_jsx(ProgressStepper, { currentStep: 4 }), _jsx("h1", { className: "mb-1 font-sans text-[24px] font-bold text-foreground xl:text-[30px]", children: "Create Account" }), _jsx("p", { className: "mb-6 font-[Geist_Mono] text-[13px] font-semibold text-[#155DFC] xl:mb-8 xl:text-[14px]", children: "Create a strong password" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4 xl:gap-5", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsxs("label", { htmlFor: "password", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: ["Password", _jsx("span", { className: "ml-0.5 text-[#DC2626]", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password", ...register('password'), className: cn('h-[40px] w-full rounded-lg border border-gray-200 p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.password && 'border-destructive'), disabled: mutation.isPending }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? _jsx(EyeOff, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" }) : _jsx(Eye, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" }) })] }), errors.password && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.password.message }))] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsxs("label", { htmlFor: "confirmPassword", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: ["Confirm Password", _jsx("span", { className: "ml-0.5 text-[#DC2626]", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "confirmPassword", type: showConfirmPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password", ...register('confirmPassword'), className: cn('h-[40px] w-full rounded-lg border border-gray-200 p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.confirmPassword && 'border-destructive'), disabled: mutation.isPending }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "aria-label": showConfirmPassword ? 'Hide password' : 'Show password', children: showConfirmPassword ? _jsx(EyeOff, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" }) : _jsx(Eye, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" }) })] }), errors.confirmPassword && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.confirmPassword.message }))] }), apiErrorMessage && (_jsxs("div", { className: "relative rounded-lg border border-[#DC2626] bg-white px-4 pt-5 pb-3", children: [_jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DC2626]", children: _jsx(AlertCircle, { className: "h-3.5 w-3.5 text-[#DC2626]" }) }), _jsx("p", { className: "text-center font-[Geist_Mono] text-[12px] font-medium text-[#DC2626] xl:text-[13px]", children: apiErrorMessage })] })), _jsx("button", { type: "submit", disabled: mutation.isPending, className: cn('h-[46px] w-full rounded-lg bg-[#155DFC] font-[Geist_Mono] text-[14px] font-medium text-white', 'flex items-center justify-center', 'hover:bg-[#1250D4] transition-colors', 'disabled:opacity-70 disabled:cursor-not-allowed'), children: mutation.isPending ? _jsx(Spinner, { size: "sm", className: "text-white" }) : 'Create Account' })] })] }));
}
