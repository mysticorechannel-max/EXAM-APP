import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import type { Diploma } from '../types/diploma.types';

interface DiplomaCardProps {
    diploma: Diploma;
}

export function DiplomaCard({ diploma }: DiplomaCardProps) {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);

    return (
        <button
            type="button"
            onClick={() => navigate(`/dashboard/diplomas/${diploma.id}`)}
            className="group relative h-[448px] w-full overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            {/* Full-size image */}
            {diploma.image && !imgError ? (
                <img
                    src={diploma.image}
                    alt={diploma.title}
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <GraduationCap className="h-16 w-16 text-blue-400" />
                </div>
            )}

            {/* Blue overlay at the bottom */}
            <div
                className="absolute inset-x-[10px] bottom-[10px] rounded-lg p-[16px]"
                style={{
                    backgroundColor: 'rgba(21, 93, 252, 0.75)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <h3 className="truncate text-left font-[Geist_Mono] text-sm font-semibold text-white">
                    {diploma.title}
                </h3>
                <p className="mt-[4px] line-clamp-2 text-left font-[Geist_Mono] text-xs text-white/80">
                    {diploma.description}
                </p>
            </div>
        </button>
    );
}
