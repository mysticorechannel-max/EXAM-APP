import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
export default function LoginPage() {
    return (_jsx(AuthLayout, { children: _jsx(LoginForm, {}) }));
}
