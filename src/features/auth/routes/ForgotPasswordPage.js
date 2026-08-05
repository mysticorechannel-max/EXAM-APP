import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/AuthLayout';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
export default function ForgotPasswordPage() {
    return (_jsx(AuthLayout, { children: _jsx(ForgotPasswordForm, {}) }));
}
