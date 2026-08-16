import { cn } from '@/shared/utils';

interface ProgressStepperProps {
    currentStep: number;
    totalSteps?: number;
}

export function ProgressStepper({ currentStep, totalSteps = 4 }: ProgressStepperProps) {
    return (
        <div className="mb-6 flex w-full items-center justify-between xl:mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <div key={step} className="flex flex-1 items-center">
                        {/* Diamond indicator */}
                        <div className="relative flex items-center justify-center">
                            <div
                                className={cn(
                                    'rotate-45',
                                    isActive || isCompleted
                                        ? 'h-[10px] w-[10px] bg-[#155DFC]'
                                        : 'h-[8px] w-[8px] border-[1.5px] border-[#155DFC] bg-transparent'
                                )}
                            />
                        </div>

                        {/* Connecting line */}
                        {step < totalSteps && (
                            <div
                                className={cn(
                                    'flex-1',
                                    step < currentStep
                                        ? 'h-[2px] bg-[#155DFC]'
                                        : 'border-t-[2px] border-dashed border-[#155DFC] opacity-50'
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
