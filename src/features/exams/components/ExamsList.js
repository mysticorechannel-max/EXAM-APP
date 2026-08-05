import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExamCard } from './ExamCard';
import { ExamCardSkeleton } from './ExamCardSkeleton';
export function ExamsList({ exams, isLoading, isError, refetch }) {
    if (isLoading) {
        return (_jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white", children: Array.from({ length: 5 }).map((_, i) => (_jsx(ExamCardSkeleton, {}, i))) }));
    }
    if (isError) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Something went wrong while loading exams." }), _jsx("button", { type: "button", onClick: refetch, className: "mt-3 rounded-lg bg-[#155DFC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700", children: "Try Again" })] }));
    }
    if (!exams || exams.length === 0) {
        return (_jsx("div", { className: "flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16", children: _jsx("p", { className: "text-sm text-gray-600", children: "No exams found." }) }));
    }
    return (_jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white", children: [exams.map((exam) => (_jsx(ExamCard, { exam: exam }, exam.id))), _jsx("div", { className: "border-t border-gray-200 px-4 py-3 text-center", children: _jsx("p", { className: "text-xs text-gray-400", children: "End of list" }) })] }));
}
