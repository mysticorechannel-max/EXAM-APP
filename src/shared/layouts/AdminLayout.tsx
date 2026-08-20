import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SidebarUserCard } from '@/features/users/components/SidebarUserCard';
import folderCodeIcon from '@/assets/icons/admin/folder-code.svg';
import elevateLogo from '@/assets/icons/common/Final Logo 1.svg';
import graduationCapIcon from '@/assets/icons/admin/graduation-cap.svg';
import bookOpenCheckIcon from '@/assets/icons/admin/book-open-check.svg';
import userRoundIcon from '@/assets/icons/admin/user-round.svg';
import logsIcon from '@/assets/icons/admin/logs.svg';

const adminNavItems = [
    { label: 'Diplomas', path: '/admin/diplomas', icon: graduationCapIcon },
    { label: 'Exams', path: '/admin/exams', icon: bookOpenCheckIcon },
    { label: 'Account Settings', path: '/admin/account-settings', icon: userRoundIcon },
    { label: 'Audit Log', path: '/admin/audit-logs', icon: logsIcon },
];

function BrandLogo() {
    return (
        <div className="flex flex-col gap-1">
            <img src={elevateLogo} alt="ELEVATE" className="h-[37px] w-[192px] brightness-0 invert" />
            <div className="flex items-center gap-1.5">
                <img src={folderCodeIcon} alt="" className="h-[30px] w-[30px]" />
                <span className="font-[Geist_Mono] text-[20px] font-semibold text-white">
                    Exam App
                </span>
            </div>
        </div>
    );
}

export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — dark navy */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-gray-700 bg-[#1F2937] transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo */}
                <div className="px-5 pt-6">
                    <BrandLogo />
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 pt-[40px]">
                    {adminNavItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 font-[Geist_Mono] text-base font-normal transition-colors ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <img src={item.icon} alt="" className="h-6 w-6" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User card */}
                <div className="border-t border-gray-700 p-4">
                    <SidebarUserCard variant="dark" />
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile header */}
                <header className="flex items-center border-b border-gray-200 bg-[#1F2937] px-4 py-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="p-1.5 text-gray-300 hover:text-white"
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    <div className="mx-auto w-full rounded bg-white shadow-sm">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
