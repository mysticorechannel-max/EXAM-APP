import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function AuthSuspense({ children }) {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "flex h-screen items-center justify-center", children: _jsx(Spinner, { size: "lg" }) }), children: children }));
}
export default function AuthRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "login", element: _jsx(AuthSuspense, { children: _jsx(LoginPage, {}) }) }), _jsx(Route, { path: "register", element: _jsx(AuthSuspense, { children: _jsx(CreateAccountPage, {}) }) }), _jsx(Route, { path: "verify-email", element: _jsx(AuthSuspense, { children: _jsx(VerifyEmailPage, {}) }) }), _jsx(Route, { path: "user-info", element: _jsx(AuthSuspense, { children: _jsx(UserInfoPage, {}) }) }), _jsx(Route, { path: "create-password", element: _jsx(AuthSuspense, { children: _jsx(CreatePasswordPage, {}) }) }), _jsx(Route, { path: "forgot-password", element: _jsx(AuthSuspense, { children: _jsx(ForgotPasswordPage, {}) }) }), _jsx(Route, { path: "password-reset-sent", element: _jsx(AuthSuspense, { children: _jsx(PasswordResetSentPage, {}) }) }), _jsx(Route, { path: "create-new-password", element: _jsx(AuthSuspense, { children: _jsx(CreateNewPasswordPage, {}) }) }), _jsx(Route, { path: "reset-password", element: _jsx(AuthSuspense, { children: _jsx(CreateNewPasswordPage, {}) }) })] }));
}
