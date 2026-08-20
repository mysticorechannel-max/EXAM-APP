import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import bookOpenCheckIcon from '@/assets/icons/common/book-open-check.svg';
import { Spinner } from '@/shared/components';
import { useDiplomaDetails } from '../hooks/useDiplomaDetails';
import { useExams } from '@/features/exams/hooks/useExams';
import { ExamsList } from '@/features/exams/components/ExamsList';

export function DiplomaDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { data: diploma, isLoading, isError, refetch } = useDiplomaDetails(id ?? '');
    const {
        data: examsData,
        isLoading: examsLoading,
        isError: examsError,
        refetch: examsRefetch,
    } = useExams({ diplomaId: id });

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError || !diploma) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
                <p className="text-sm text-gray-600">Failed to load diploma details.</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-3 rounded-lg bg-[#155DFC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 font-[Geist_Mono] text-sm text-gray-500">
                <Link to="/dashboard/diplomas" className="transition-colors hover:text-gray-900">
                    Diplomas
                </Link>
                <span>/</span>
                <Link to="/dashboard/diplomas" className="transition-colors hover:text-gray-900">
                    {diploma.title}
                </Link>
                <span>/</span>
                <span className="font-medium text-[#155DFC]">Exams</span>
            </nav>

            {/* Blue banner header with separate back button */}
            <div className="flex items-stretch gap-2">
                <Link
                    to="/dashboard/diplomas"
                    className="flex w-[48px] items-center justify-center border border-[#155DFC] text-[#155DFC] hover:bg-blue-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div className="flex flex-1 items-center gap-3 bg-[#155DFC] px-4 py-3">
                    <img src={bookOpenCheckIcon} alt="" className="h-7 w-7 brightness-0 invert" />
                    <h1 className="font-sans text-[20px] font-semibold text-white">
                        {diploma.title} Exams
                    </h1>
                </div>
            </div>

            {/* Exams list directly */}
            <ExamsList
                exams={examsData?.data}
                isLoading={examsLoading}
                isError={examsError}
                refetch={examsRefetch}
            />
        </div>
    );
}
