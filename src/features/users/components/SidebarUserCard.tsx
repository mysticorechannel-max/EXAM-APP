import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MoreVertical, User, LogOut } from 'lucide-react';
import boltIcon from '@/assets/icons/common/bolt.svg';
import { authService } from '@/features/auth/services/auth.service';
import { useProfile } from '../hooks/useProfile';

export function SidebarUserCard({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
    const { data: user, isLoading } = useProfile();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminContext = location.pathname.startsWith('/admin');

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
            if (stored) return JSON.parse(stored);
        } catch { /* ignore */ }
        return null;
    }

    const storedUser = getStoredUser();
    const displayUser = user || storedUser;

    if (isLoading && !displayUser) {
        return (
            <div className="flex items-center gap-3 p-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    if (!displayUser) return null;

    const firstName = displayUser.firstName || '';
    const lastName = displayUser.lastName || '';
    const email = displayUser.email || '';
    const profilePhoto = displayUser.profilePhoto || '';
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

    const isDark = variant === 'dark';

    return (
        <div ref={menuRef} className={`relative flex items-center gap-3 p-3 ${isDark ? '' : ''}`}>
            {profilePhoto ? (
                <img
                    src={profilePhoto}
                    alt={`${firstName} ${lastName}`}
                    className="h-10 w-10 object-cover"
                />
            ) : (
                <div className={`flex h-10 w-10 items-center justify-center text-sm font-semibold ${isDark ? 'bg-gray-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                    {initials || 'U'}
                </div>
            )}

            <div className="min-w-0 flex-1">
                <p className={`truncate font-[Geist_Mono] text-sm font-bold ${isDark ? 'text-white' : 'text-[#155DFC]'}`}>
                    {firstName} {lastName}
                </p>
                <p className={`truncate font-[Geist_Mono] text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {email}
                </p>
            </div>

            <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`p-1 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                aria-label="User menu"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
                <div className="absolute bottom-full left-2 right-2 z-20 mb-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <button
                        type="button"
                        onClick={() => {
                            setMenuOpen(false);
                            navigate(isAdminContext ? '/admin/account-settings' : '/dashboard/account');
                        }}
                        className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <User className="h-4 w-4" />
                        Account
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMenuOpen(false);
                            navigate(isAdminContext ? '/admin/diplomas' : '/dashboard/diplomas');
                        }}
                        className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <img src={boltIcon} alt="" className="h-[18px] w-[18px]" />
                        Dashboard
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-[#DC2626] hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4 -scale-x-100" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
