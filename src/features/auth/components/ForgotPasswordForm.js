import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { forgotPasswordSchema } from '../schemas/forgot-password.schema';
import { useForgotPasswordMutation } from '../hooks/useForgotPasswordMutation';
import { isApiError } from '@/shared/api';
export function ForgotPasswordForm() {
    const mutation = useForgotPasswordMutation();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });
    const onSubmit = (data) => {
        mutation.reset();
        mutation.mutate({
            email: data.email,
            redirectUrl: `${window.location.origin}/auth/reset-password`,
        });
    };
    const apiErrorMessage = mutation.error
        ? isApiError(mutation.error)
            ? mutation.error.message
            : 'Something went wrong'
        : null;
    return (_jsxs("div", { className: "w-full max-w-[380px] xl:max-w-[452px]", children: [_jsx("h1", { className: "mb-1 font-sans text-[24px] font-bold text-foreground xl:text-[30px]", children: "Forgot Password" }), _jsx("p", { className: "mb-8 font-[Geist_Mono] text-[13px] text-muted-foreground xl:text-[14px]", children: "Don't worry, we will help you recover your account." }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4 xl:gap-5", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: "email", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: "Email" }), _jsx("input", { id: "email", type: "email", placeholder: "user@example.com", ...register('email'), className: cn('h-[40px] w-full rounded-lg border border-gray-200 p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.email && 'border-destructive'), disabled: mutation.isPending }), errors.email && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.email.message }))] }), apiErrorMessage && (_jsxs("div", { className: "relative rounded-lg border border-[#DC2626] bg-white px-4 pt-5 pb-3", children: [_jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DC2626]", children: _jsx(AlertCircle, { className: "h-3.5 w-3.5 text-[#DC2626]" }) }), _jsx("p", { className: "text-center font-[Geist_Mono] text-[12px] font-medium text-[#DC2626] xl:text-[13px]", children: apiErrorMessage })] })), _jsx("button", { type: "submit", disabled: mutation.isPending, className: cn('h-[46px] w-full rounded-lg bg-[#155DFC] font-[Geist_Mono] text-[14px] font-medium text-white', 'flex items-center justify-center gap-2', 'hover:bg-[#1250D4] transition-colors', 'disabled:opacity-70 disabled:cursor-not-allowed'), children: mutation.isPending ? (_jsx(Spinner, { size: "sm", className: "text-white" })) : (_jsxs(_Fragment, { children: ["Next", _jsx(ChevronRight, { className: "h-4 w-4" })] })) })] }), _jsxs("p", { className: "mt-5 text-center font-[Geist_Mono] text-[13px] font-medium text-muted-foreground xl:mt-6 xl:text-[14px]", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/auth/register", className: "text-[#155DFC] hover:underline", children: "Create yours" })] })] }));
}
