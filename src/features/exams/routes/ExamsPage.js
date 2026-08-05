import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { GraduationCap, ChevronLeft } from 'lucide-react';
import { Spinner } from '@/shared/components';
import { useDiplomaDetails } from '@/features/diplomas/hooks/useDiplomaDetails';
import { useExams } from '../hooks/useExams';
import { ExamsList } from '../components/ExamsList';
export function ExamsPage() {
    const { diplomaId } = useParams();
    const { data: diploma, isLoading: diplomaLoading } = useDiplomaDetails(diplomaId ?? '');
    const { data: examsData, isLoading: examsLoading, isError, refetch } = useExams({ diplomaId: diplomaId });
    if (diplomaLoading) {
        return (_jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    const diplomaTitle = diploma?.title ?? 'Diploma';
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { to: `/dashboard/diplomas/${diplomaId}`, className: "flex items-center gap-1 rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900", "aria-label": "Back", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) }), _jsxs("nav", { className: "flex items-center gap-1 text-sm text-gray-500", children: [_jsx(Link, { to: "/dashboard/diplomas", className: "transition-colors hover:text-gray-900", children: "Diplomas" }), _jsx("span", { children: "/" }), _jsx(Link, { to: `/dashboard/diplomas/${diplomaId}`, className: "transition-colors hover:text-gray-900", children: diplomaTitle }), _jsx("span", { children: "/" }), _jsx("span", { className: "font-medium text-gray-900", children: "Exams" })] })] }), _jsxs("div", { className: "flex items-center gap-3 rounded-xl bg-[#155DFC] px-6 py-4", children: [_jsx(GraduationCap, { className: "h-6 w-6 text-white" }), _jsxs("h1", { className: "font-[Geist_Mono] text-[18px] font-semibold text-white xl:text-[20px]", children: [diplomaTitle, " Exams"] })] }), _jsx(ExamsList, { exams: examsData?.data, isLoading: examsLoading, isError: isError, refetch: refetch })] }));
}
