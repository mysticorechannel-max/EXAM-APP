import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/AuthLayout';
import { UserInfoForm } from '../components/UserInfoForm';
export default function UserInfoPage() {
    return (_jsx(AuthLayout, { children: _jsx(UserInfoForm, {}) }));
}
