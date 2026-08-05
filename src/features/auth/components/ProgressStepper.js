import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/shared/utils';
export function ProgressStepper({ currentStep, totalSteps = 4 }) {
    return (_jsx("div", { className: "mb-6 flex w-full items-center justify-between xl:mb-8", children: Array.from({ length: totalSteps }).map((_, index) => {
            const step = index + 1;
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            return (_jsxs("div", { className: "flex flex-1 items-center", children: [_jsx("div", { className: cn('relative flex items-center justify-center', isActive && 'rounded-full bg-blue-100 p-2'), children: _jsx("div", { className: cn('rotate-45', isActive
                                ? 'h-[10px] w-[10px] bg-[#155DFC]'
                                : isCompleted
                                    ? 'h-[10px] w-[10px] bg-[#155DFC]'
                                    : 'h-[8px] w-[8px] bg-gray-300') }) }), step < totalSteps && (_jsx("div", { className: cn('h-[1px] flex-1', step < currentStep ? 'bg-[#155DFC]' : 'bg-gray-200') }))] }, step));
        }) }));
}
