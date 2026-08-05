import { AuthBranding } from './AuthBranding';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2">
                <div className="flex w-full bg-[#EFF6FF]/75 backdrop-blur-[200px] lg:px-8 lg:py-16 xl:px-12 xl:py-[116px]">
                    <AuthBranding />
                </div>
            </div>

            {/* Right panel */}
            <div className="flex w-full items-center justify-center px-6 py-10 lg:w-[55%] xl:w-1/2">
                {children}
            </div>
        </div>
    );
}
