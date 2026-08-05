import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/AuthLayout';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
export default function CreateNewPasswordPage() {
    return (_jsx(AuthLayout, { children: _jsx(ResetPasswordForm, {}) }));
}
