import { useParams, Link } from 'react-router-dom';
import { GraduationCap, ChevronLeft } from 'lucide-react';
import { Spinner } from '@/shared/components';
import { useDiplomaDetails } from '@/features/diplomas/hooks/useDiplomaDetails';
import { useExams } from '../hooks/useExams';
import { ExamsList } from '../components/ExamsList';

export function ExamsPage() {
    const { diplomaId } = useParams<{ diplomaId: string }>();
    const { data: diploma, isLoading: diplomaLoading } = useDiplomaDetails(diplomaId ?? '');
    const { data: examsData, isLoading: examsLoading, isError, refetch } = useExams({ diplomaId: diplomaId });

    if (diplomaLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const diplomaTitle = diploma?.title ?? 'Diploma';

    return (
        <div className="flex flex-col gap-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
                <Link
                    to={`/dashboard/diplomas/${diplomaId}`}
                    className="flex items-center gap-1 rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Back"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <nav className="flex items-center gap-1 text-sm text-gray-500">
                    <Link
                        to="/dashboard/diplomas"
                        className="transition-colors hover:text-gray-900"
                    >
                        Diplomas
                    </Link>
                    <span>/</span>
                    <Link
                        to={`/dashboard/diplomas/${diplomaId}`}
                        className="transition-colors hover:text-gray-900"
                    >
                        {diplomaTitle}
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-gray-900">Exams</span>
                </nav>
            </div>

            {/* Blue banner */}
            <div className="flex items-center gap-3 rounded-xl bg-[#155DFC] px-6 py-4">
                <GraduationCap className="h-6 w-6 text-white" />
                <h1 className="font-[Geist_Mono] text-[18px] font-semibold text-white xl:text-[20px]">
                    {diplomaTitle} Exams
                </h1>
            </div>

            {/* Exams list */}
            <ExamsList
                exams={examsData?.data}
                isLoading={examsLoading}
                isError={isError}
                refetch={refetch}
            />
        </div>
    );
}
