import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { GraduationCap, ChevronLeft } from 'lucide-react';
import { Spinner } from '@/shared/components';
import { useDiplomaDetails } from '../hooks/useDiplomaDetails';
import { useExams } from '@/features/exams/hooks/useExams';
import { ExamsList } from '@/features/exams/components/ExamsList';
export function DiplomaDetailsPage() {
    const { id } = useParams();
    const { data: diploma, isLoading, isError, refetch } = useDiplomaDetails(id ?? '');
    const { data: examsData, isLoading: examsLoading, isError: examsError, refetch: examsRefetch, } = useExams({ diplomaId: id });
    if (isLoading) {
        return (_jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (isError || !diploma) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Failed to load diploma details." }), _jsx("button", { type: "button", onClick: () => refetch(), className: "mt-3 rounded-lg bg-[#155DFC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700", children: "Try Again" })] }));
    }
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("nav", { className: "flex items-center gap-1 font-[Geist_Mono] text-sm text-gray-500", children: [_jsx(Link, { to: "/dashboard/diplomas", className: "transition-colors hover:text-gray-900", children: "Diplomas" }), _jsx("span", { children: "/" }), _jsx(Link, { to: "/dashboard/diplomas", className: "transition-colors hover:text-gray-900", children: diploma.title }), _jsx("span", { children: "/" }), _jsx("span", { className: "font-medium text-[#155DFC]", children: "Exams" })] }), _jsxs("div", { className: "flex items-stretch gap-2", children: [_jsx(Link, { to: "/dashboard/diplomas", className: "flex w-[48px] items-center justify-center border border-[#155DFC] text-[#155DFC] hover:bg-blue-50", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex flex-1 items-center gap-3 bg-[#155DFC] px-6 py-4", children: [_jsx(GraduationCap, { className: "h-6 w-6 text-white" }), _jsxs("h1", { className: "font-[Geist_Mono] text-[14px] font-normal text-white", children: [diploma.title, " Exams"] })] })] }), _jsx(ExamsList, { exams: examsData?.data, isLoading: examsLoading, isError: examsError, refetch: examsRefetch })] }));
}
