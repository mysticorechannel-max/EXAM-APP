import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DiplomaCard } from './DiplomaCard';
import { DiplomaCardSkeleton } from './DiplomaCardSkeleton';
export function DiplomasGrid({ diplomas, isLoading, isError, refetch }) {
    if (isLoading) {
        return (_jsx("div", { className: "grid grid-cols-1 gap-[10px] md:grid-cols-2 xl:grid-cols-3", children: Array.from({ length: 6 }).map((_, i) => (_jsx(DiplomaCardSkeleton, {}, i))) }));
    }
    if (isError) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Something went wrong while loading diplomas." }), _jsx("button", { type: "button", onClick: refetch, className: "mt-3 rounded-lg bg-[#155DFC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700", children: "Try Again" })] }));
    }
    if (!diplomas || diplomas.length === 0) {
        return (_jsx("div", { className: "flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16", children: _jsx("p", { className: "text-sm text-gray-600", children: "No diplomas found." }) }));
    }
    return (_jsx("div", { className: "grid grid-cols-1 gap-[10px] md:grid-cols-2 xl:grid-cols-3", children: diplomas.map((diploma) => (_jsx(DiplomaCard, { diploma: diploma }, diploma.id))) }));
}
