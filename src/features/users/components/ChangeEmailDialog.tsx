import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Spinner } from '@/shared/components';
import { apiClient } from '@/shared/api';
import { useQueryClient } from '@tanstack/react-query';

interface ChangeEmailDialogProps {
    open: boolean;
    onClose: () => void;
}

type Step = 'email' | 'otp';

export function ChangeEmailDialog({ open, onClose }: ChangeEmailDialogProps) {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
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
        if (countdown <= 0) return;
        const timer = setInterval(() => setCountdown(c => c - 1), 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleRequestEmail = async () => {
        if (!email.trim()) { setError('Please enter an email'); return; }
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/users/email/request', { newEmail: email });
            setStep('otp');
            setCountdown(60);
        } catch (e: any) {
            setError(e?.message || 'Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const code = otp.join('');
        if (code.length < 6) { setError('Please enter the full code'); return; }
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/users/email/confirm', { code });
            queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
            onClose();
        } catch (e: any) {
            setError(e?.message || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        // Handle paste of full code
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (index + i < 6) newOtp[index + i] = d;
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

    const handleOtpPaste = (e: React.ClipboardEvent) => {
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

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setLoading(true);
        try {
            await apiClient.post('/users/email/request', { newEmail: email });
            setCountdown(60);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-xl">
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Progress indicator */}
                <div className="mb-6 flex items-center">
                    <div className={`h-3 w-3 rotate-45 border-2 ${step === 'email' ? 'border-[#155DFC] bg-[#155DFC]' : 'border-[#155DFC] bg-[#155DFC]'}`} />
                    <div className={`h-0 flex-1 border-t-2 border-dashed ${step === 'otp' ? 'border-[#155DFC]' : 'border-[#155DFC]'}`} />
                    <div className={`h-3 w-3 rotate-45 border-2 ${step === 'otp' ? 'border-[#155DFC] bg-[#155DFC]' : 'border-[#155DFC] bg-white'}`} />
                </div>

                <h2 className="mb-3 text-[22px] font-bold text-gray-900">Change Email</h2>

                {step === 'email' ? (
                    <>
                        <p className="mb-5 text-[16px] font-semibold text-[#155DFC]">
                            Enter your new email
                        </p>
                        <label className="mb-2 block text-[14px] font-bold text-gray-900">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="mb-6 h-[50px] w-full rounded-xl border border-gray-200 px-4 font-[Geist_Mono] text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        {error && <p className="mb-3 text-center text-xs text-red-500">{error}</p>}
                        <div className="-mx-8 -mb-8 rounded-b-2xl bg-gray-50 px-8 py-5">
                            <button
                                type="button"
                                onClick={handleRequestEmail}
                                disabled={loading}
                                className="flex h-[50px] w-full items-center justify-center rounded-full bg-[#155DFC] text-[14px] font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                            >
                                {loading ? <Spinner size="sm" className="text-white" /> : 'Next  >'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-1 text-[16px] font-semibold text-[#155DFC]">
                            Verify OTP
                        </p>
                        <p className="mb-1 text-[13px] text-gray-500">
                            Please enter the 6-digits code we have sent to:
                        </p>
                        <p className="mb-5 text-[13px] text-gray-700">
                            {email}.{' '}
                            <button type="button" onClick={() => setStep('email')} className="text-[#155DFC] underline">
                                Edit
                            </button>
                        </p>

                        {/* OTP inputs */}
                        <div className="mb-3 flex items-center justify-center gap-2">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputsRef.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    onPaste={handleOtpPaste}
                                    className="h-[42px] w-[42px] rounded-lg border border-gray-200 text-center text-[14px] font-bold text-gray-900 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            ))}
                        </div>

                        <p className="mb-4 text-center text-[12px] text-gray-500">
                            {countdown > 0 ? (
                                `You can request another code in: ${countdown}s`
                            ) : (
                                <button type="button" onClick={handleResend} className="text-[#155DFC] underline">
                                    Resend code
                                </button>
                            )}
                        </p>

                        {error && <p className="mb-3 text-center text-xs text-red-500">{error}</p>}
                        <div className="-mx-8 -mb-8 rounded-b-2xl bg-gray-50 px-8 py-5">
                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="flex h-[50px] w-full items-center justify-center rounded-full bg-[#155DFC] text-[14px] font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                            >
                                {loading ? <Spinner size="sm" className="text-white" /> : 'Verify Code'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
