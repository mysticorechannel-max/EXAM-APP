import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useDiplomas } from '../hooks/useDiplomas';
import { DiplomasGrid } from '../components/DiplomasGrid';
import graduationCapIcon from '@/assets/icons/common/graduation-cap.svg';

const SCROLL_KEY = 'diplomas-scroll-position';
const SHOW_ALL_KEY = 'diplomas-show-all';

export function DiplomasPage() {
    const location = useLocation();
    const [showAll, setShowAll] = useState(false);
    const { data, isLoading, isError, refetch } = useDiplomas({ page: 1, limit: 100 });
    const containerRef = useRef<HTMLDivElement>(null);

    const diplomas = data?.data;

    // Fixed display order by diploma title
    const TITLE_ORDER = [
        'DevOps Engineering',
        'Mobile App Development',
        'UI/UX Design',
        'Cyber Security',
        'Machine Learning',
        'Data Science',
        'Master UI and UX design principles',
        'Backend Development Diploma',
        'Product Management',
        'Software Testing',
        'Artificial Intelligence',
        'Mobile App Development Diploma',
    ];

    const sortedDiplomas = diplomas ? [...diplomas].sort((a, b) => {
        const indexA = TITLE_ORDER.findIndex(t => a.title.toLowerCase().includes(t.toLowerCase()));
        const indexB = TITLE_ORDER.findIndex(t => b.title.toLowerCase().includes(t.toLowerCase()));
        const posA = indexA === -1 ? TITLE_ORDER.length : indexA;
        const posB = indexB === -1 ? TITLE_ORDER.length : indexB;
        return posA - posB;
    }) : undefined;
    const displayDiplomas = sortedDiplomas ? (showAll ? sortedDiplomas : sortedDiplomas.slice(0, 6)) : undefined;
    const hasMore = sortedDiplomas && sortedDiplomas.length > 6 && !showAll;

    // Restore scroll position every time data finishes loading on this page.
    // This runs on mount and on back-navigation.
    useLayoutEffect(() => {
        if (isLoading || !displayDiplomas) return;

        const savedScroll = sessionStorage.getItem(SCROLL_KEY);
        if (!savedScroll) return;

        const mainEl = containerRef.current?.closest('main');
        if (!mainEl) return;

        requestAnimationFrame(() => {
            mainEl.scrollTop = parseInt(savedScroll, 10);
        });
    }, [isLoading, displayDiplomas]);

    // Save scroll position continuously
    useEffect(() => {
        const mainEl = containerRef.current?.closest('main');
        if (!mainEl) return;

        const handleScroll = () => {
            sessionStorage.setItem(SCROLL_KEY, String(mainEl.scrollTop));
        };
        mainEl.addEventListener('scroll', handleScroll);
        return () => mainEl.removeEventListener('scroll', handleScroll);
    }, []);

    // Clear saved state when navigating away from diplomas section entirely
    useEffect(() => {
        if (!location.pathname.startsWith('/dashboard/diplomas')) {
            sessionStorage.removeItem(SCROLL_KEY);
            sessionStorage.removeItem(SHOW_ALL_KEY);
        }
    }, [location.pathname]);

    return (
        <div ref={containerRef} className="flex flex-col gap-[10px]">
            {/* Breadcrumb box */}
            <div className="flex items-center bg-white px-4 py-4">
                <p className="font-[Geist_Mono] text-sm text-gray-500">Diplomas</p>
            </div>

            {/* Blue banner header */}
            <div className="flex items-center gap-3 bg-[#155DFC] px-4 py-3">
                <img src={graduationCapIcon} alt="" className="h-7 w-7" />
                <h1 className="font-sans text-[20px] font-semibold text-white">
                    Diplomas
                </h1>
            </div>

            {/* Diplomas grid */}
            <DiplomasGrid
                diplomas={displayDiplomas}
                isLoading={isLoading}
                isError={isError}
                refetch={refetch}
            />

            {/* Scroll to view more indicator */}
            {hasMore && (
                <button
                    type="button"
                    onClick={() => {
                        setShowAll(true);
                        sessionStorage.setItem(SHOW_ALL_KEY, 'true');
                    }}
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
