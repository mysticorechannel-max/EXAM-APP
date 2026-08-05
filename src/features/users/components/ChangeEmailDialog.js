import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Spinner } from '@/shared/components';
import { apiClient } from '@/shared/api';
import { useQueryClient } from '@tanstack/react-query';
export function ChangeEmailDialog({ open, onClose }) {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const inputsRef = useRef([]);
    const queryClient = useQueryClient();
    useEffect(() => {
        if (!open) {
            setStep('email');
            setEmail('');
            setOtp(['', '', '', '', '', '']);
            setError('');
            setCountdown(0);
        }
    }, [open]);
    useEffect(() => {
        if (countdown <= 0)
            return;
        const timer = setInterval(() => setCountdown(c => c - 1), 1000);
        return () => clearInterval(timer);
    }, [countdown]);
    const handleRequestEmail = async () => {
        if (!email.trim()) {
            setError('Please enter an email');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/users/email/request', { newEmail: email });
            setStep('otp');
            setCountdown(60);
        }
        catch (e) {
            setError(e?.message || 'Failed to send verification code');
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerifyOtp = async () => {
        const code = otp.join('');
        if (code.length < 6) {
            setError('Please enter the full code');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/users/email/confirm', { code });
            queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
            onClose();
        }
        catch (e) {
            setError(e?.message || 'Invalid code');
        }
        finally {
            setLoading(false);
        }
    };
    const handleOtpChange = (index, value) => {
        // Handle paste of full code
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (index + i < 6)
                    newOtp[index + i] = d;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + digits.length, 5);
            inputsRef.current[nextIndex]?.focus();
            return;
        }
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const digits = pastedData.split('');
            const newOtp = ['', '', '', '', '', ''];
            digits.forEach((d, i) => { newOtp[i] = d; });
            setOtp(newOtp);
            const nextIndex = Math.min(digits.length, 5);
            inputsRef.current[nextIndex]?.focus();
        }
    };
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };
    const handleResend = async () => {
        if (countdown > 0)
            return;
        setLoading(true);
        try {
            await apiClient.post('/users/email/request', { newEmail: email });
            setCountdown(60);
        }
        catch { /* ignore */ }
        finally {
            setLoading(false);
        }
    };
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: _jsxs("div", { className: "relative w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-xl", children: [_jsx("button", { type: "button", onClick: onClose, className: "absolute right-4 top-4 text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-5 w-5" }) }), _jsxs("div", { className: "mb-6 flex items-center", children: [_jsx("div", { className: `h-3 w-3 rotate-45 border-2 ${step === 'email' ? 'border-[#155DFC] bg-[#155DFC]' : 'border-[#155DFC] bg-[#155DFC]'}` }), _jsx("div", { className: `h-0 flex-1 border-t-2 border-dashed ${step === 'otp' ? 'border-[#155DFC]' : 'border-[#155DFC]'}` }), _jsx("div", { className: `h-3 w-3 rotate-45 border-2 ${step === 'otp' ? 'border-[#155DFC] bg-[#155DFC]' : 'border-[#155DFC] bg-white'}` })] }), _jsx("h2", { className: "mb-3 text-[22px] font-bold text-gray-900", children: "Change Email" }), step === 'email' ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "mb-5 text-[16px] font-semibold text-[#155DFC]", children: "Enter your new email" }), _jsx("label", { className: "mb-2 block text-[14px] font-bold text-gray-900", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "user@example.com", className: "mb-6 h-[50px] w-full rounded-xl border border-gray-200 px-4 font-[Geist_Mono] text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-blue-100" }), error && _jsx("p", { className: "mb-3 text-center text-xs text-red-500", children: error }), _jsx("div", { className: "-mx-8 -mb-8 rounded-b-2xl bg-gray-50 px-8 py-5", children: _jsx("button", { type: "button", onClick: handleRequestEmail, disabled: loading, className: "flex h-[50px] w-full items-center justify-center rounded-full bg-[#155DFC] text-[14px] font-semibold text-white hover:bg-blue-700 disabled:opacity-70", children: loading ? _jsx(Spinner, { size: "sm", className: "text-white" }) : 'Next  >' }) })] })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "mb-1 text-[16px] font-semibold text-[#155DFC]", children: "Verify OTP" }), _jsx("p", { className: "mb-1 text-[13px] text-gray-500", children: "Please enter the 6-digits code we have sent to:" }), _jsxs("p", { className: "mb-5 text-[13px] text-gray-700", children: [email, ".", ' ', _jsx("button", { type: "button", onClick: () => setStep('email'), className: "text-[#155DFC] underline", children: "Edit" })] }), _jsx("div", { className: "mb-3 flex items-center justify-center gap-2", children: otp.map((digit, i) => (_jsx("input", { ref: (el) => { inputsRef.current[i] = el; }, type: "text", inputMode: "numeric", maxLength: 6, value: digit, onChange: (e) => handleOtpChange(i, e.target.value), onKeyDown: (e) => handleOtpKeyDown(i, e), onPaste: handleOtpPaste, className: "h-[42px] w-[42px] rounded-lg border border-gray-200 text-center text-[14px] font-bold text-gray-900 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-blue-100" }, i))) }), _jsx("p", { className: "mb-4 text-center text-[12px] text-gray-500", children: countdown > 0 ? (`You can request another code in: ${countdown}s`) : (_jsx("button", { type: "button", onClick: handleResend, className: "text-[#155DFC] underline", children: "Resend code" })) }), error && _jsx("p", { className: "mb-3 text-center text-xs text-red-500", children: error }), _jsx("div", { className: "-mx-8 -mb-8 rounded-b-2xl bg-gray-50 px-8 py-5", children: _jsx("button", { type: "button", onClick: handleVerifyOtp, disabled: loading, className: "flex h-[50px] w-full items-center justify-center rounded-full bg-[#155DFC] text-[14px] font-semibold text-white hover:bg-blue-700 disabled:opacity-70", children: loading ? _jsx(Spinner, { size: "sm", className: "text-white" }) : 'Verify Code' }) })] }))] }) }));
}
