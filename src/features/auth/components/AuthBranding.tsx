import folderCodeIcon from '../../../lucide/folder-code.svg';
import brainIcon from '../../../lucide/brain.svg';
import bookCheckIcon from '../../../lucide/book-check.svg';
import messageDotsIcon from '../../../lucide/message-dots.svg';

export function AuthBranding() {
    return (
        <div className="flex flex-col">
            {/* Brand */}
            <div className="flex items-center gap-2">
                <img src={folderCodeIcon} alt="" className="h-7 w-7" />
                <span className="font-[Geist_Mono] text-[16px] font-semibold text-[#155DFC]">
                    Exam App
                </span>
            </div>

            {/* Hero Title */}
            <h2 className="mt-12 font-sans text-[22px] font-bold leading-tight text-foreground xl:mt-16 xl:text-[26px] xl:leading-[34px]">
                Empower your learning journey
                <br />
                with our smart exam platform.
            </h2>

            {/* Feature list */}
            <div className="mt-8 flex flex-col gap-6 xl:mt-10 xl:gap-8">
                <FeatureItem
                    icon={<img src={brainIcon} alt="Brain" className="h-8 w-8" />}
                    hasBorder={false}
                    title="Tailored Diplomas"
                    description="Choose from specialized tracks like Frontend, Backend, and Mobile Development."
                />
                <FeatureItem
                    icon={<img src={bookCheckIcon} alt="Book Check" className="h-8 w-8" />}
                    hasBorder={false}
                    title="Focused Exams"
                    description="Access topic-specific tests including HTML, CSS, JavaScript, and more."
                />
                <FeatureItem
                    icon={<img src={messageDotsIcon} alt="Smart Forms" className="h-8 w-8" />}
                    hasBorder={false}
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
    hasBorder = true,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    hasBorder?: boolean;
}) {
    return (
        <div className="flex items-start gap-3">
            {hasBorder ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#155DFC]/40 bg-white/50 text-[#155DFC]">
                    {icon}
                </div>
            ) : (
                <div className="shrink-0">
                    {icon}
                </div>
            )}
            <div className="flex flex-col gap-0.5">
                <p className="font-[Geist_Mono] text-[14px] font-bold text-[#155DFC]">
                    {title}
                </p>
                <p className="font-[Geist_Mono] text-[12px] font-medium leading-relaxed text-[#475569]">
                    {description}
                </p>
            </div>
        </div>
    );
}
