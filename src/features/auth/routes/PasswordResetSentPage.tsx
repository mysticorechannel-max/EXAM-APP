import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export default function PasswordResetSentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = (location.state as { email?: string })?.email ?? '';

    return (
        <AuthLayout>
            <div className="w-full max-w-[380px] xl:max-w-[452px]">
                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate('/auth/forgot-password')}
                    className="mb-8 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-muted-foreground hover:text-foreground hover:border-gray-300 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>

                {/* Title */}
                <h1 className="mb-3 font-sans text-[22px] font-bold text-foreground xl:text-[24px]">
                    Password Reset Sent
                </h1>

                {/* Body */}
                <p className="font-[Geist_Mono] text-[14px] leading-relaxed text-muted-foreground xl:text-[16px]">
                    We have sent a password reset link to:
                </p>

                <p className="mb-4 font-[Geist_Mono] text-[14px] font-semibold text-[#155DFC] xl:text-[16px]">
                    {email}
                </p>

                <p className="mb-3 font-[Geist_Mono] text-[14px] leading-relaxed text-muted-foreground xl:text-[16px]">
                    Please check your inbox and follow the instructions to reset your password.
                </p>

                <p className="mb-4 font-[Geist_Mono] text-[13px] leading-relaxed text-muted-foreground/70 xl:text-[14px]">
                    If you don&apos;t see the email within a few minutes, check your spam or junk folder.
                </p>

                {/* Footer */}
                <p className="font-[Geist_Mono] text-[13px] font-medium text-muted-foreground xl:text-[14px]">
                    Don&apos;t have an account?{' '}
                    <Link to="/auth/register" className="text-[#155DFC] hover:underline">
                        Create yours
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
