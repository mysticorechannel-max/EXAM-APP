import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/AuthLayout';
import { CreatePasswordForm } from '../components/CreatePasswordForm';
export default function CreatePasswordPage() {
    return (_jsx(AuthLayout, { children: _jsx(CreatePasswordForm, {}) }));
}
