import { DiplomaCard } from './DiplomaCard';
import { DiplomaCardSkeleton } from './DiplomaCardSkeleton';
import type { Diploma } from '../types/diploma.types';

interface DiplomasGridProps {
    diplomas: Diploma[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

export function DiplomasGrid({ diplomas, isLoading, isError, refetch }: DiplomasGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <DiplomaCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
                <p className="text-sm text-gray-600">
                    Something went wrong while loading diplomas.
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

    if (!diplomas || diplomas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
                <p className="text-sm text-gray-600">No diplomas found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2 xl:grid-cols-3">
            {diplomas.map((diploma) => (
                <DiplomaCard key={diploma.id} diploma={diploma} />
            ))}
        </div>
    );
}
