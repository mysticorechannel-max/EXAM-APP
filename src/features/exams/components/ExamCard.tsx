import { useNavigate } from 'react-router-dom';
import type { Exam } from '../types/exam.types';

interface ExamCardProps {
    exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-4 last:border-b-0">
            {/* Image */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                {exam.image ? (
                    <img
                        src={exam.image}
                        alt={exam.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-50">
                        <span className="text-lg text-blue-400">📝</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-1">
                <button
                    type="button"
                    onClick={() => navigate(`/dashboard/exams/${exam.id}/quiz`)}
                    className="text-left text-sm font-semibold text-[#155DFC] transition-colors hover:text-blue-700"
                >
                    {exam.title}
                </button>
                <p className="line-clamp-1 text-xs text-gray-500">
                    {exam.description}
                </p>
            </div>

            {/* Meta info */}
            <div className="flex flex-shrink-0 flex-col items-end gap-2">
                <span className="text-xs text-gray-500">
                    {exam.questionsCount} Questions • {exam.duration} minutes
                </span>
                <button
                    type="button"
                    onClick={() => navigate(`/dashboard/exams/${exam.id}/quiz`)}
                    className="rounded-lg bg-[#155DFC] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                >
                    START →
                </button>
            </div>
        </div>
    );
}
