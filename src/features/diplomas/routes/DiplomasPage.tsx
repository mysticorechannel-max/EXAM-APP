import { useState, useEffect, useRef } from 'react';
import { GraduationCap, ChevronDown } from 'lucide-react';
import { useDiplomas } from '../hooks/useDiplomas';
import { DiplomasGrid } from '../components/DiplomasGrid';

const SCROLL_KEY = 'diplomas-scroll-position';

export function DiplomasPage() {
    const [showAll, setShowAll] = useState(false);
    const { data, isLoading, isError, refetch } = useDiplomas({ page: 1, limit: showAll ? 100 : 6 });
    const containerRef = useRef<HTMLDivElement>(null);

    const diplomas = data?.data;
    const sortedDiplomas = diplomas ? [...diplomas].sort((a, b) => {
        if (a.immutable && !b.immutable) return -1;
        if (!a.immutable && b.immutable) return 1;
        return 0;
    }) : undefined;
    const totalItems = data?.metadata?.total ?? 0;
    const hasMore = !showAll && totalItems > 6;

    // Restore scroll position only when navigating back (not on fresh visit)
    useEffect(() => {
        if (!isLoading && sortedDiplomas) {
            const savedScroll = sessionStorage.getItem(SCROLL_KEY);
            if (savedScroll) {
                const mainEl = containerRef.current?.closest('main');
                if (mainEl) {
                    setTimeout(() => {
                        mainEl.scrollTop = parseInt(savedScroll, 10);
                    }, 50);
                }
                sessionStorage.removeItem(SCROLL_KEY);
            }
        }
    }, [isLoading, sortedDiplomas]);

    // Save scroll position continuously (for back navigation)
    useEffect(() => {
        const mainEl = containerRef.current?.closest('main');
        if (!mainEl) return;

        const handleScroll = () => {
            sessionStorage.setItem(SCROLL_KEY, String(mainEl.scrollTop));
        };
        mainEl.addEventListener('scroll', handleScroll);
        return () => mainEl.removeEventListener('scroll', handleScroll);
    }, []);

    // Clear scroll position when navigating away from diplomas entirely
    useEffect(() => {
        return () => {
            // Only keep scroll if going to a diploma detail page
            const path = window.location.pathname;
            if (!path.startsWith('/dashboard/diplomas/')) {
                sessionStorage.removeItem(SCROLL_KEY);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col gap-[10px]">
            {/* Breadcrumb */}
            <p className="font-[Geist_Mono] text-sm text-gray-500">Diplomas</p>

            {/* Blue banner header */}
            <div className="flex items-center gap-3 rounded-xl bg-[#155DFC] px-6 py-4">
                <GraduationCap className="h-6 w-6 text-white" />
                <h1 className="font-[Geist_Mono] text-[14px] font-normal text-white">
                    Diplomas
                </h1>
            </div>

            {/* Diplomas grid */}
            <DiplomasGrid
                diplomas={sortedDiplomas}
                isLoading={isLoading}
                isError={isError}
                refetch={refetch}
            />

            {/* Scroll to view more indicator */}
            {hasMore && (
                <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="flex flex-col items-center gap-1 py-3"
                >
                    <p className="font-[Geist_Mono] text-sm text-gray-500">
                        Scroll to view more
                    </p>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
            )}
        </div>
    );
}
