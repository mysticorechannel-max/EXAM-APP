import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/AuthLayout';
import { VerifyEmailForm } from '../components/VerifyEmailForm';
export default function VerifyEmailPage() {
    return (_jsx(AuthLayout, { children: _jsx(VerifyEmailForm, {}) }));
}
