import { AuthBranding } from './AuthBranding';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2">
                <div className="flex w-full items-center justify-center bg-gradient-to-br from-[#F3F8FF] via-[#DEEDFF] to-[#CCE3FF] backdrop-blur-[200px] lg:px-10 lg:py-24 xl:px-16 xl:py-[116px]">
                    <div className="w-full max-w-[480px]">
                        <AuthBranding />
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex w-full items-center justify-center px-6 py-10 lg:w-[55%] xl:w-1/2">
                {children}
            </div>
        </div>
    );
}
