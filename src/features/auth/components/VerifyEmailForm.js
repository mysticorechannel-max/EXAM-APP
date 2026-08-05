import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { verifyEmailSchema } from '../schemas/verify-email.schema';
import { useVerifyEmailMutation } from '../hooks/useVerifyEmailMutation';
import { useResendOtpMutation } from '../hooks/useResendOtpMutation';
import { isApiError } from '@/shared/api';
import { OtpInput } from './OtpInput';
import { ProgressStepper } from './ProgressStepper';
const COUNTDOWN_SECONDS = 60;
export function VerifyEmailForm() {
    const location = useLocation();
    const email = location.state?.email ?? '';
    const mutation = useVerifyEmailMutation();
    const resendMutation = useResendOtpMutation();
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const { control, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: { otp: '' },
    });
    useEffect(() => {
        if (countdown <= 0)
            return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);
    const handleResend = useCallback(() => {
        if (countdown > 0 || !email)
            return;
        resendMutation.mutate({ email });
        setCountdown(COUNTDOWN_SECONDS);
    }, [countdown, email, resendMutation]);
    const onSubmit = (data) => {
        mutation.reset();
        mutation.mutate({ code: data.otp, email });
    };
    const apiErrorMessage = mutation.error
        ? isApiError(mutation.error)
            ? mutation.error.message
            : 'Something went wrong'
        : null;
    return (_jsxs("div", { className: "w-full max-w-[380px] xl:max-w-[452px]", children: [_jsx(ProgressStepper, { currentStep: 2 }), _jsx("h1", { className: "mb-1 font-sans text-[24px] font-bold text-foreground xl:text-[30px]", children: "Create Account" }), _jsx("p", { className: "mb-4 font-[Geist_Mono] text-[14px] font-semibold text-[#155DFC] xl:text-[16px]", children: "Verify OTP" }), _jsxs("p", { className: "mb-6 font-[Geist_Mono] text-[13px] text-muted-foreground xl:mb-8 xl:text-[14px]", children: ["Please enter the 6-digit code we have sent to:", ' ', _jsx("span", { className: "font-medium text-foreground", children: email || 'user@example.com' }), ".", ' ', _jsx(Link, { to: "/auth/register", className: "font-medium text-foreground underline", children: "Edit" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4 xl:gap-5", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx(Controller, { name: "otp", control: control, render: ({ field }) => (_jsx(OtpInput, { value: field.value, onChange: field.onChange, disabled: mutation.isPending, hasError: !!errors.otp })) }), errors.otp && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.otp.message }))] }), _jsx("p", { className: "text-center font-[Geist_Mono] text-[13px] text-muted-foreground xl:text-[14px]", children: countdown > 0 ? (`You can request another code in: ${countdown}s`) : (_jsx("button", { type: "button", onClick: handleResend, disabled: resendMutation.isPending, className: "font-medium text-[#155DFC] underline disabled:opacity-70", children: "Resend code" })) }), apiErrorMessage && (_jsxs("div", { className: "relative rounded-lg border border-[#DC2626] bg-white px-4 pt-5 pb-3", children: [_jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DC2626]", children: _jsx(AlertCircle, { className: "h-3.5 w-3.5 text-[#DC2626]" }) }), _jsx("p", { className: "text-center font-[Geist_Mono] text-[12px] font-medium text-[#DC2626] xl:text-[13px]", children: apiErrorMessage })] })), _jsx("button", { type: "submit", disabled: mutation.isPending, className: cn('h-[46px] w-full rounded-lg border border-[#155DFC] bg-[#EFF6FF] font-[Geist_Mono] text-[14px] font-medium text-gray-800', 'flex items-center justify-center', 'hover:bg-blue-100 transition-colors', 'disabled:opacity-70 disabled:cursor-not-allowed'), children: mutation.isPending ? _jsx(Spinner, { size: "sm", className: "text-gray-800" }) : 'Verify Code' })] })] }));
}
