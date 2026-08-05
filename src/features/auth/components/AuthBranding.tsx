import { Globe2, MonitorPlay, LayoutList } from 'lucide-react';
import folderCodeIcon from '../../../lucide/folder-code.svg';

export function AuthBranding() {
    return (
        <div className="flex flex-col">
            {/* Brand */}
            <div className="flex items-center gap-2">
                <img src={folderCodeIcon} alt="" className="h-8 w-8 xl:h-9 xl:w-9" />
                <span className="font-[Geist_Mono] text-[20px] font-semibold text-[#155DFC]">
                    Exam App
                </span>
            </div>

            {/* Hero Title */}
            <h2 className="mt-16 font-sans text-[24px] font-bold leading-tight text-foreground xl:mt-20 xl:text-[30px] xl:leading-[38px]">
                Empower your learning journey
                <br />
                with our smart exam platform.
            </h2>

            {/* Feature list */}
            <div className="mt-10 flex flex-col gap-8 xl:mt-12 xl:gap-10">
                <FeatureItem
                    icon={<Globe2 className="h-5 w-5 xl:h-6 xl:w-6" />}
                    title="Tailored Diplomas"
                    description="Choose from specialized tracks like Frontend, Backend, and Mobile Development."
                />
                <FeatureItem
                    icon={<MonitorPlay className="h-5 w-5 xl:h-6 xl:w-6" />}
                    title="Focused Exams"
                    description="Access topic-specific tests including HTML, CSS, JavaScript, and more."
                />
                <FeatureItem
                    icon={<LayoutList className="h-5 w-5 xl:h-6 xl:w-6" />}
                    title="Smart Multi-Step Forms"
                    description="Choose from specialized tracks like Frontend, Backend, and Mobile Development."
                />
            </div>
        </div>
    );
}

function FeatureItem({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-blue-300 text-[#155DFC] xl:h-11 xl:w-11">
                {icon}
            </div>
            <div className="flex flex-col gap-1">
                <p className="font-[Geist_Mono] text-[20px] font-semibold text-[#155DFC]">
                    {title}
                </p>
                <p className="font-[Geist_Mono] text-[16px] font-normal leading-[100%] text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}
