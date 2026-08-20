import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, ChevronLeft, User } from 'lucide-react';
import { cn } from '@/shared/utils';
import { authService } from '@/features/auth/services/auth.service';
import { ProfileForm } from '../components/ProfileForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import circleUserIcon from '@/assets/icons/common/circle-user-round.svg';
import lockIcon from '@/assets/icons/common/lock.svg';

type Tab = 'profile' | 'change-password';

export function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminContext = location.pathname.startsWith('/admin');
    const backPath = isAdminContext ? '/admin/diplomas' : '/dashboard/diplomas';

    const handleLogout = () => {
        authService.clearAuthData();
        navigate('/auth/login');
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Breadcrumb */}
            <p className="font-[Geist_Mono] text-sm text-gray-500">Account</p>

            {/* Blue banner header with separate back button */}
            <div className="flex items-stretch gap-3">
                <Link
                    to={backPath}
                    className="flex w-[45px] items-center justify-center border border-[#155DFC] text-[#155DFC] hover:bg-blue-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div className="flex flex-1 items-center gap-3 bg-[#155DFC] px-6 py-4">
                    <User className="h-7 w-7 text-white" />
                    <h1 className="font-sans text-[24px] font-bold text-white">
                        Account Settings
                    </h1>
                </div>
            </div>

            {/* Content area: left sub-nav + right form */}
            <div className="flex flex-col lg:flex-row">
                {/* Left sub-nav - 234px, border-right */}
                <div className="flex w-full flex-col border-r border-gray-200 lg:min-h-[713px] lg:w-[234px] lg:shrink-0">
                    <div className="flex flex-col gap-1 pt-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2.5 text-left font-[Geist_Mono] text-sm font-medium transition-colors',
                                activeTab === 'profile'
                                    ? 'bg-blue-50 text-[#155DFC]'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <img src={circleUserIcon} alt="" className="h-5 w-5" />
                            Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('change-password')}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2.5 text-left font-[Geist_Mono] text-sm font-medium transition-colors',
                                activeTab === 'change-password'
                                    ? 'bg-blue-50 text-[#155DFC]'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <img src={lockIcon} alt="" className="h-5 w-5" />
                            Change Password
                        </button>
                    </div>

                    {/* Logout button - at bottom */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-auto flex items-center gap-3 bg-[#FEF2F2] px-4 py-2.5 text-left font-[Geist_Mono] text-sm font-medium text-[#DC2626] transition-colors hover:bg-red-100"
                    >
                        <LogOut className="h-5 w-5 -scale-x-100" />
                        Logout
                    </button>
                </div>

                {/* Right content - white bg, padding 24px, gap 16px */}
                <div className="flex-1 bg-white p-6">
                    {activeTab === 'profile' && <ProfileForm />}
                    {activeTab === 'change-password' && <ChangePasswordForm />}
                </div>
            </div>
        </div>
    );
}
