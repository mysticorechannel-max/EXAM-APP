import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/utils';
import { authService } from '@/features/auth/services/auth.service';
import { ProfileForm } from '../components/ProfileForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'change-password', label: 'Change Password', icon: Lock },
];
export function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();
    const handleLogout = () => {
        authService.clearAuthData();
        navigate('/auth/login');
    };
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("p", { className: "font-[Geist_Mono] text-sm text-gray-500", children: "Account" }), _jsxs("div", { className: "flex items-stretch gap-2", children: [_jsx(Link, { to: "/dashboard/diplomas", className: "flex w-[48px] items-center justify-center border border-[#155DFC] text-[#155DFC] hover:bg-blue-50", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex flex-1 items-center gap-3 bg-[#155DFC] px-6 py-4", children: [_jsx(User, { className: "h-6 w-6 text-white" }), _jsx("h1", { className: "font-[Geist_Mono] text-[14px] font-normal text-white", children: "Account Settings" })] })] }), _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row", children: [_jsxs("div", { className: "flex w-full flex-col lg:min-h-[400px] lg:w-[180px] lg:shrink-0", children: [_jsx("div", { className: "flex flex-col gap-1", children: tabs.map((tab) => (_jsxs("button", { type: "button", onClick: () => setActiveTab(tab.id), className: cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-[Geist_Mono] text-[13px] font-medium transition-colors xl:text-[14px]', activeTab === tab.id
                                        ? 'text-[#155DFC]'
                                        : 'text-gray-700 hover:text-gray-900'), children: [_jsx(tab.icon, { className: "h-4 w-4" }), tab.label] }, tab.id))) }), _jsxs("button", { type: "button", onClick: handleLogout, className: "mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-[Geist_Mono] text-[13px] font-medium text-[#DC2626] transition-colors hover:bg-red-50 xl:text-[14px]", children: [_jsx(LogOut, { className: "h-4 w-4 -scale-x-100" }), "Logout"] })] }), _jsxs("div", { className: "flex-1", children: [activeTab === 'profile' && _jsx(ProfileForm, {}), activeTab === 'change-password' && _jsx(ChangePasswordForm, {})] })] })] }));
}
