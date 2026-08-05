import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, User, LayoutDashboard, LogOut } from 'lucide-react';
import { authService } from '@/features/auth/services/auth.service';
import { useProfile } from '../hooks/useProfile';
export function SidebarUserCard() {
    const { data: user, isLoading } = useProfile();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleLogout = () => {
        authService.clearAuthData();
        navigate('/auth/login');
    };
    // Fallback to localStorage if API hasn't returned yet
    function getStoredUser() {
        try {
            const stored = localStorage.getItem('user');
            if (stored)
                return JSON.parse(stored);
        }
        catch { /* ignore */ }
        return null;
    }
    const storedUser = getStoredUser();
    const displayUser = user || storedUser;
    if (isLoading && !displayUser) {
        return (_jsxs("div", { className: "flex items-center gap-3 p-3", children: [_jsx("div", { className: "h-10 w-10 animate-pulse rounded-full bg-gray-200" }), _jsxs("div", { className: "flex-1 space-y-1", children: [_jsx("div", { className: "h-4 w-24 animate-pulse rounded bg-gray-200" }), _jsx("div", { className: "h-3 w-32 animate-pulse rounded bg-gray-200" })] })] }));
    }
    if (!displayUser)
        return null;
    const firstName = displayUser.firstName || '';
    const lastName = displayUser.lastName || '';
    const email = displayUser.email || '';
    const profilePhoto = displayUser.profilePhoto || '';
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
    return (_jsxs("div", { ref: menuRef, className: "relative flex items-center gap-3 p-3", children: [profilePhoto ? (_jsx("img", { src: profilePhoto, alt: `${firstName} ${lastName}`, className: "h-10 w-10 rounded-lg object-cover" })) : (_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-600", children: initials || 'U' })), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("p", { className: "truncate font-[Geist_Mono] text-sm font-bold text-[#155DFC]", children: [firstName, " ", lastName] }), _jsx("p", { className: "truncate font-[Geist_Mono] text-xs text-gray-500", children: email })] }), _jsx("button", { type: "button", onClick: () => setMenuOpen((prev) => !prev), className: "rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600", "aria-label": "User menu", children: _jsx(MoreVertical, { className: "h-4 w-4" }) }), menuOpen && (_jsxs("div", { className: "absolute bottom-full left-2 right-2 z-20 mb-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg", children: [_jsxs("button", { type: "button", onClick: () => {
                            setMenuOpen(false);
                            navigate('/dashboard/account');
                        }, className: "flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(User, { className: "h-4 w-4" }), "Account"] }), _jsxs("button", { type: "button", onClick: () => {
                            setMenuOpen(false);
                            navigate('/dashboard/diplomas');
                        }, className: "flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(LayoutDashboard, { className: "h-4 w-4" }), "Dashboard"] }), _jsxs("button", { type: "button", onClick: handleLogout, className: "flex w-full items-center gap-2 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-[#DC2626] hover:bg-red-50", children: [_jsx(LogOut, { className: "h-4 w-4 -scale-x-100" }), "Logout"] })] }))] }));
}
