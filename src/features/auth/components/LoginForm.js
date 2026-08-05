import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { loginSchema } from '../schemas/login.schema';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { isApiError } from '@/shared/api';
export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const loginMutation = useLoginMutation();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: '', password: '' },
    });
    const onSubmit = (data) => {
        loginMutation.reset();
        loginMutation.mutate(data);
    };
    const apiErrorMessage = loginMutation.error
        ? isApiError(loginMutation.error)
            ? loginMutation.error.message
            : 'Something went wrong'
        : null;
    return (_jsxs("div", { className: "w-full max-w-[380px] xl:max-w-[452px]", children: [_jsx("h1", { className: "mb-6 font-sans text-[24px] font-bold text-foreground xl:mb-8 xl:text-[30px]", children: "Login" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4 xl:gap-5", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: "username", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: "Username" }), _jsx("input", { id: "username", type: "text", placeholder: "user123", ...register('username'), className: cn('h-[40px] w-full rounded-lg border p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.username ? 'border-destructive' : 'border-input'), disabled: loginMutation.isPending }), errors.username && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.username.message }))] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: "password", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register('password'), className: cn('h-[40px] w-full rounded-lg border p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.password ? 'border-destructive' : 'border-input'), disabled: loginMutation.isPending }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? _jsx(EyeOff, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" }) : _jsx(Eye, { className: "h-[18px] w-[18px] xl:h-5 xl:w-5" }) })] }), errors.password && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.password.message }))] }), _jsx("div", { className: "flex justify-end", children: _jsx(Link, { to: "/auth/forgot-password", className: "font-[Geist_Mono] text-[13px] font-medium text-blue-600 hover:underline xl:text-[14px]", children: "Forgot your password?" }) }), apiErrorMessage && (_jsxs("div", { className: "relative rounded-lg border border-[#DC2626] bg-white px-4 pt-5 pb-3", children: [_jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DC2626]", children: _jsx(AlertCircle, { className: "h-3.5 w-3.5 text-[#DC2626]" }) }), _jsx("p", { className: "text-center font-[Geist_Mono] text-[12px] font-medium text-[#DC2626] xl:text-[13px]", children: apiErrorMessage })] })), _jsx("button", { type: "submit", disabled: loginMutation.isPending, className: cn('h-[46px] w-full rounded-lg bg-[#155DFC] font-[Geist_Mono] text-[14px] font-medium text-white', 'flex items-center justify-center', 'hover:bg-[#1250D4] transition-colors', 'disabled:opacity-70 disabled:cursor-not-allowed'), children: loginMutation.isPending ? _jsx(Spinner, { size: "sm", className: "text-white" }) : 'Login' })] }), _jsxs("p", { className: "mt-5 text-center font-[Geist_Mono] text-[13px] font-medium text-muted-foreground xl:mt-6 xl:text-[14px]", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/auth/register", className: "text-blue-600 hover:underline", children: "Create yours" })] })] }));
}
