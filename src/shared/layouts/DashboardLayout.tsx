import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { GraduationCap, User, Menu, X } from 'lucide-react';
import { SidebarUserCard } from '@/features/users/components/SidebarUserCard';
import folderCodeIcon from '@/assets/icons/common/folder-code.svg';
import elevateLogo from '@/assets/icons/common/Final Logo 1.svg';

function BrandLogo() {
    return (
        <div className="flex flex-col gap-1">
            <img src={elevateLogo} alt="ELEVATE" className="h-[37px] w-[192px]" />
            <div className="flex items-center gap-1.5">
                <img src={folderCodeIcon} alt="" className="h-5 w-5" />
                <span className="font-[Geist_Mono] text-sm font-bold text-[#155DFC]">
                    Exam App
                </span>
            </div>
        </div>
    );
}

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Diplomas is active for all diploma, exam, and result routes
    const isDiplomasActive =
        location.pathname.startsWith('/dashboard/diplomas') ||
        location.pathname.startsWith('/dashboard/exams');

    const isAccountActive = location.pathname.startsWith('/dashboard/account');

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="px-5 py-6">
                    <BrandLogo />
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 px-3 pt-4">
                    <Link
                        to="/dashboard/diplomas"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 font-[Geist_Mono] text-sm font-medium transition-colors ${isDiplomasActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <GraduationCap className="h-5 w-5" />
                        Diplomas
                    </Link>
                    <Link
                        to="/dashboard/account"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 font-[Geist_Mono] text-sm font-medium transition-colors ${isAccountActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <User className="h-5 w-5" />
                        Account Settings
                    </Link>
                </nav>

                {/* User card */}
                <div className="border-t border-gray-200 p-2">
                    <SidebarUserCard />
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile header */}
                <header className="flex items-center border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100"
                    >
                        {sidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                    <div className="ml-3 flex items-center gap-1.5">
                        <img src={elevateLogo} alt="ELEVATE" className="h-[24px] w-auto" />
                        <img src={folderCodeIcon} alt="" className="h-4 w-4" />
                        <span className="font-[Geist_Mono] text-xs font-bold text-[#155DFC]">
                            Exam App
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
