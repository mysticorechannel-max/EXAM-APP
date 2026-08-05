import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/utils';
import { authService } from '@/features/auth/services/auth.service';
import { ProfileForm } from '../components/ProfileForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';

type Tab = 'profile' | 'change-password';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'change-password', label: 'Change Password', icon: Lock },
];

export function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.clearAuthData();
        navigate('/auth/login');
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Breadcrumb */}
            <p className="font-[Geist_Mono] text-sm text-gray-500">Account</p>

            {/* Blue banner header with separate back button */}
            <div className="flex items-stretch gap-2">
                <Link
                    to="/dashboard/diplomas"
                    className="flex w-[48px] items-center justify-center border border-[#155DFC] text-[#155DFC] hover:bg-blue-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div className="flex flex-1 items-center gap-3 bg-[#155DFC] px-6 py-4">
                    <User className="h-6 w-6 text-white" />
                    <h1 className="font-[Geist_Mono] text-[14px] font-normal text-white">
                        Account Settings
                    </h1>
                </div>
            </div>

            {/* Content area: left sub-nav + right form */}
            <div className="flex flex-col gap-4 lg:flex-row">
                {/* Left sub-nav */}
                <div className="flex w-full flex-col lg:min-h-[400px] lg:w-[180px] lg:shrink-0">
                    <div className="flex flex-col gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-[Geist_Mono] text-[13px] font-medium transition-colors xl:text-[14px]',
                                    activeTab === tab.id
                                        ? 'text-[#155DFC]'
                                        : 'text-gray-700 hover:text-gray-900'
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Logout button - at bottom */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-[Geist_Mono] text-[13px] font-medium text-[#DC2626] transition-colors hover:bg-red-50 xl:text-[14px]"
                    >
                        <LogOut className="h-4 w-4 -scale-x-100" />
                        Logout
                    </button>
                </div>

                {/* Right content - no border wrapper like Figma */}
                <div className="flex-1">
                    {activeTab === 'profile' && <ProfileForm />}
                    {activeTab === 'change-password' && <ChangePasswordForm />}
                </div>
            </div>
        </div>
    );
}
