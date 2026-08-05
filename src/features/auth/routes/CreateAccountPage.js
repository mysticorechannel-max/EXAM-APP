import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/AuthLayout';
import { CreateAccountForm } from '../components/CreateAccountForm';
export default function CreateAccountPage() {
    return (_jsx(AuthLayout, { children: _jsx(CreateAccountForm, {}) }));
}
