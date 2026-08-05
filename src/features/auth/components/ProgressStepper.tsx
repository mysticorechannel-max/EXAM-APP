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
                        <div
                            className={cn(
                                'relative flex items-center justify-center',
                                isActive && 'rounded-full bg-blue-100 p-2'
                            )}
                        >
                            <div
                                className={cn(
                                    'rotate-45',
                                    isActive
                                        ? 'h-[10px] w-[10px] bg-[#155DFC]'
                                        : isCompleted
                                            ? 'h-[10px] w-[10px] bg-[#155DFC]'
                                            : 'h-[8px] w-[8px] bg-gray-300'
                                )}
                            />
                        </div>

                        {/* Connecting line */}
                        {step < totalSteps && (
                            <div
                                className={cn(
                                    'h-[1px] flex-1',
                                    step < currentStep ? 'bg-[#155DFC]' : 'bg-gray-200'
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
