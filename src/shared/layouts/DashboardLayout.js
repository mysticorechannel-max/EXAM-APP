import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { GraduationCap, User, Menu, X } from 'lucide-react';
import { SidebarUserCard } from '@/features/users/components/SidebarUserCard';
import folderCodeIcon from '../../lucide/folder-code.svg';
const navItems = [
    {
        label: 'Diplomas',
        path: '/dashboard/diplomas',
        icon: GraduationCap,
    },
    {
        label: 'Account Settings',
        path: '/dashboard/account',
        icon: User,
    },
];
function BrandLogo() {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-2xl font-extrabold tracking-tight text-gray-800", children: "ELEVATE" }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("img", { src: folderCodeIcon, alt: "", className: "h-5 w-5" }), _jsx("span", { className: "font-[Geist_Mono] text-sm font-bold text-[#155DFC]", children: "Exam App" })] })] }));
}
export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsxs("div", { className: "flex h-screen overflow-hidden", children: [sidebarOpen && (_jsx("div", { className: "fixed inset-0 z-30 bg-black/50 lg:hidden", onClick: () => setSidebarOpen(false) })), _jsxs("aside", { className: `fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsx("div", { className: "px-5 py-6", children: _jsx(BrandLogo, {}) }), _jsx("nav", { className: "flex-1 space-y-1 px-3 pt-2", children: navItems.map((item) => (_jsxs(NavLink, { to: item.path, onClick: () => setSidebarOpen(false), className: ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 font-[Geist_Mono] text-sm font-medium transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`, children: [_jsx(item.icon, { className: "h-5 w-5" }), item.label] }, item.path))) }), _jsx("div", { className: "border-t border-gray-200 p-2", children: _jsx(SidebarUserCard, {}) })] }), _jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [_jsxs("header", { className: "flex items-center border-b border-gray-200 bg-white px-4 py-3 lg:hidden", children: [_jsx("button", { type: "button", onClick: () => setSidebarOpen(true), className: "rounded-md p-1.5 text-gray-600 hover:bg-gray-100", children: sidebarOpen ? (_jsx(X, { className: "h-5 w-5" })) : (_jsx(Menu, { className: "h-5 w-5" })) }), _jsxs("div", { className: "ml-3 flex items-center gap-1.5", children: [_jsx("span", { className: "text-base font-extrabold tracking-tight text-gray-800", children: "ELEVATE" }), _jsx("img", { src: folderCodeIcon, alt: "", className: "h-4 w-4" }), _jsx("span", { className: "font-[Geist_Mono] text-xs font-bold text-[#155DFC]", children: "Exam App" })] })] }), _jsx("main", { className: "flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-6", children: _jsx("div", { className: "mx-auto w-full max-w-[1200px]", children: _jsx(Outlet, {}) }) })] })] }));
}
