import { ExamCard } from './ExamCard';
import { ExamCardSkeleton } from './ExamCardSkeleton';
import type { Exam } from '../types/exam.types';

interface ExamsListProps {
    exams: Exam[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

export function ExamsList({ exams, isLoading, isError, refetch }: ExamsListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-[10px]">
                {Array.from({ length: 5 }).map((_, i) => (
                    <ExamCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
                <p className="text-sm text-gray-600">
                    Something went wrong while loading exams.
                </p>
                <button
                    type="button"
                    onClick={refetch}
                    className="mt-3 rounded-lg bg-[#155DFC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!exams || exams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
                <p className="text-sm text-gray-600">No exams found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-[10px]">
            {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
            ))}
            {/* End of list indicator */}
            <p className="py-3 text-center text-[12px] text-gray-400">
                End of list
            </p>
        </div>
    );
}
