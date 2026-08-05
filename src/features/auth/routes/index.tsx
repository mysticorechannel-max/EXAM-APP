import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/shared/components';

// 1. Login
const LoginPage = lazy(() => import('./LoginPage'));
// 2. Create Account (Email only)
const CreateAccountPage = lazy(() => import('./CreateAccountPage'));
// 3. Verify Email (OTP)
const VerifyEmailPage = lazy(() => import('./VerifyEmailPage'));
// 4. User Info (First Name, Last Name, Username, Phone)
const UserInfoPage = lazy(() => import('./UserInfoPage'));
// 5. Create Password
const CreatePasswordPage = lazy(() => import('./CreatePasswordPage'));
// 6. Forgot Password
const ForgotPasswordPage = lazy(() => import('./ForgotPasswordPage'));
// 7. Password Reset Sent / Verify OTP
const PasswordResetSentPage = lazy(() => import('./PasswordResetSentPage'));
// 8. Create New Password
const CreateNewPasswordPage = lazy(() => import('./CreateNewPasswordPage'));

function AuthSuspense({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            {children}
        </Suspense>
    );
}

export default function AuthRoutes() {
    return (
        <Routes>
            <Route path="login" element={<AuthSuspense><LoginPage /></AuthSuspense>} />
            <Route path="register" element={<AuthSuspense><CreateAccountPage /></AuthSuspense>} />
            <Route path="verify-email" element={<AuthSuspense><VerifyEmailPage /></AuthSuspense>} />
            <Route path="user-info" element={<AuthSuspense><UserInfoPage /></AuthSuspense>} />
            <Route path="create-password" element={<AuthSuspense><CreatePasswordPage /></AuthSuspense>} />
            <Route path="forgot-password" element={<AuthSuspense><ForgotPasswordPage /></AuthSuspense>} />
            <Route path="password-reset-sent" element={<AuthSuspense><PasswordResetSentPage /></AuthSuspense>} />
            <Route path="create-new-password" element={<AuthSuspense><CreateNewPasswordPage /></AuthSuspense>} />
            <Route path="reset-password" element={<AuthSuspense><CreateNewPasswordPage /></AuthSuspense>} />
        </Routes>
    );
}
