import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { Spinner, PhoneInput } from '@/shared/components';
import { userInfoSchema } from '../schemas/user-info.schema';
import { useUserInfoMutation } from '../hooks/useUserInfoMutation';
import { isApiError } from '@/shared/api';
import { ProgressStepper } from './ProgressStepper';
export function UserInfoForm() {
    const location = useLocation();
    const email = location.state?.email ?? '';
    const mutation = useUserInfoMutation();
    const { register, handleSubmit, control, formState: { errors }, } = useForm({
        resolver: zodResolver(userInfoSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            phone: '',
        },
    });
    const onSubmit = (data) => {
        mutation.reset();
        mutation.mutate({ ...data, email });
    };
    const apiErrorMessage = mutation.error
        ? isApiError(mutation.error)
            ? mutation.error.message
            : 'Something went wrong'
        : null;
    return (_jsxs("div", { className: "w-full max-w-[380px] xl:max-w-[452px]", children: [_jsx(ProgressStepper, { currentStep: 3 }), _jsx("h1", { className: "mb-1 font-sans text-[24px] font-bold text-foreground xl:text-[30px]", children: "Create Account" }), _jsx("p", { className: "mb-6 font-[Geist_Mono] text-[13px] font-medium text-[#155DFC] xl:mb-8 xl:text-[14px]", children: "Tell us more about you" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4 xl:gap-5", children: [_jsxs("div", { className: "flex gap-[10px]", children: [_jsxs("div", { className: "flex w-1/2 flex-col gap-1.5", children: [_jsxs("label", { htmlFor: "firstName", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: ["First Name", _jsx("span", { className: "ml-0.5 text-[#DC2626]", children: "*" })] }), _jsx("input", { id: "firstName", type: "text", placeholder: "John", ...register('firstName'), className: cn('h-[40px] w-full rounded-lg border border-gray-200 p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.firstName && 'border-destructive'), disabled: mutation.isPending }), errors.firstName && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.firstName.message }))] }), _jsxs("div", { className: "flex w-1/2 flex-col gap-1.5", children: [_jsxs("label", { htmlFor: "lastName", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: ["Last Name", _jsx("span", { className: "ml-0.5 text-[#DC2626]", children: "*" })] }), _jsx("input", { id: "lastName", type: "text", placeholder: "Doe", ...register('lastName'), className: cn('h-[40px] w-full rounded-lg border border-gray-200 p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.lastName && 'border-destructive'), disabled: mutation.isPending }), errors.lastName && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.lastName.message }))] })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsxs("label", { htmlFor: "username", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: ["Username", _jsx("span", { className: "ml-0.5 text-[#DC2626]", children: "*" })] }), _jsx("input", { id: "username", type: "text", placeholder: "user123", ...register('username'), className: cn('h-[40px] w-full rounded-lg border border-gray-200 p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600', 'disabled:cursor-not-allowed disabled:opacity-50', errors.username && 'border-destructive'), disabled: mutation.isPending }), errors.username && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.username.message }))] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: "phone", className: "font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]", children: "Phone" }), _jsx(Controller, { name: "phone", control: control, render: ({ field }) => (_jsx(PhoneInput, { value: field.value || undefined, onChange: (val) => field.onChange(val ?? ''), defaultCountry: "EG", disabled: mutation.isPending, hasError: !!errors.phone, placeholder: "Enter phone number" })) }), errors.phone && (_jsx("p", { className: "font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]", children: errors.phone.message }))] }), apiErrorMessage && (_jsxs("div", { className: "relative rounded-lg border border-[#DC2626] bg-white px-4 pt-5 pb-3", children: [_jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DC2626]", children: _jsx(AlertCircle, { className: "h-3.5 w-3.5 text-[#DC2626]" }) }), _jsx("p", { className: "text-center font-[Geist_Mono] text-[12px] font-medium text-[#DC2626] xl:text-[13px]", children: apiErrorMessage })] })), _jsx("button", { type: "submit", disabled: mutation.isPending, className: cn('h-[46px] w-full rounded-lg border border-[#155DFC] bg-[#EFF6FF] font-[Geist_Mono] text-[14px] font-medium text-[#111827]', 'flex items-center justify-center gap-2', 'hover:bg-[#DBEAFE] transition-colors', 'disabled:opacity-70 disabled:cursor-not-allowed'), children: mutation.isPending ? (_jsx(Spinner, { size: "sm", className: "text-[#155DFC]" })) : (_jsxs(_Fragment, { children: ["Next", _jsx(ChevronRight, { className: "h-4 w-4" })] })) })] })] }));
}
