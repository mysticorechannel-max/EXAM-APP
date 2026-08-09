import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Clock } from 'lucide-react';
import type { Exam } from '../types/exam.types';

interface ExamCardProps {
    exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const MAX_DESC_LENGTH = 200;
    const description = exam.description ?? '';
    const isLong = description.length > MAX_DESC_LENGTH;
    const displayDesc = expanded ? description : description.slice(0, MAX_DESC_LENGTH);

    return (
        <div
            className="flex gap-3 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image / Logo */}
            <div className="flex h-[90px] w-[90px] flex-shrink-0 items-center justify-center rounded-[8px] bg-[#EFF6FF]">
                {exam.image ? (
                    <img
                        src={exam.image}
                        alt={exam.title}
                        className="h-[60px] w-[60px] object-contain"
                    />
                ) : (
                    <span className="text-3xl">📝</span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-0.5">
                {/* Top row: Title + Meta */}
                <div className="flex items-start justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(`/dashboard/exams/${exam.id}/quiz`)}
                        className="text-left font-['Inter'] text-[14px] font-semibold text-[#155DFC] transition-colors hover:text-blue-700"
                    >
                        {exam.title}
                    </button>
                    <div className="flex flex-shrink-0 items-center gap-3 text-[12px] text-gray-500">
                        <span className="flex items-center gap-1">
                            <HelpCircle className="h-3.5 w-3.5" />
                            {exam.questionsCount} Questions
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {exam.duration} minutes
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="font-['Inter'] text-[12px] leading-[1.6] text-gray-500">
                    {displayDesc}
                    {isLong && !expanded && '... '}
                    {isLong && (
                        <button
                            type="button"
                            onClick={() => setExpanded(!expanded)}
                            className="ml-1 font-semibold text-gray-800 hover:underline"
                        >
                            {expanded ? 'Show Less' : 'See More'}
                        </button>
                    )}
                </p>

                {/* START button - visible on hover */}
                {hovered && (
                    <div className="mt-1.5 flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(`/dashboard/exams/${exam.id}/quiz`)}
                            className="rounded-[6px] bg-[#1D63FF] px-4 py-1.5 font-['Inter'] text-[11px] font-semibold tracking-wide text-white transition-colors hover:bg-blue-700"
                        >
                            START →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
