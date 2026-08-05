import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
export default function PasswordResetSentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email ?? '';
    return (_jsx(AuthLayout, { children: _jsxs("div", { className: "w-full max-w-[380px] xl:max-w-[452px]", children: [_jsx("button", { type: "button", onClick: () => navigate('/auth/forgot-password'), className: "mb-8 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-muted-foreground hover:text-foreground hover:border-gray-300 transition-colors", "aria-label": "Go back", children: _jsx(ArrowLeft, { className: "h-4 w-4" }) }), _jsx("h1", { className: "mb-3 font-sans text-[28px] font-bold text-foreground xl:text-[36px]", children: "Password Reset Sent" }), _jsx("p", { className: "font-[Geist_Mono] text-[14px] leading-relaxed text-muted-foreground xl:text-[16px]", children: "We have sent a password reset link to:" }), _jsx("p", { className: "mb-4 font-[Geist_Mono] text-[14px] font-semibold text-[#155DFC] xl:text-[16px]", children: email }), _jsx("p", { className: "mb-3 font-[Geist_Mono] text-[14px] leading-relaxed text-muted-foreground xl:text-[16px]", children: "Please check your inbox and follow the instructions to reset your password." }), _jsx("p", { className: "mb-8 font-[Geist_Mono] text-[13px] leading-relaxed text-muted-foreground/70 xl:text-[14px]", children: "If you don't see the email within a few minutes, check your spam or junk folder." }), _jsxs("p", { className: "text-center font-[Geist_Mono] text-[13px] font-medium text-muted-foreground xl:text-[14px]", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/auth/register", className: "text-[#155DFC] hover:underline", children: "Create yours" })] })] }) }));
}
