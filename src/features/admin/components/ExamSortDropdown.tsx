import arrowDownAZ from '../../../lucideAdmin/arrow-down-a-z.svg';
import arrowUpAZ from '../../../lucideAdmin/arrow-up-a-z.svg';
import calendarArrowDown from '../../../lucideAdmin/calendar-arrow-down.svg';
import calendarArrowUp from '../../../lucideAdmin/calendar-arrow-up.svg';
import descriptionIcon from '../../../lucideAdmin/Description.svg';

type SortOption = { sortBy: 'title' | 'questionsCount' | 'createdAt'; sortOrder: 'asc' | 'desc'; label: string; icon: string };

const SORT_OPTIONS: SortOption[] = [
    { sortBy: 'title', sortOrder: 'desc', label: 'Title (descending)', icon: arrowDownAZ },
    { sortBy: 'title', sortOrder: 'asc', label: 'Title (ascending)', icon: arrowUpAZ },
    { sortBy: 'questionsCount', sortOrder: 'desc', label: 'Questions No. (descending)', icon: arrowDownAZ },
    { sortBy: 'questionsCount', sortOrder: 'asc', label: 'Questions No. (ascending)', icon: arrowUpAZ },
    { sortBy: 'createdAt', sortOrder: 'desc', label: 'Newest (descending)', icon: calendarArrowDown },
    { sortBy: 'createdAt', sortOrder: 'asc', label: 'Newest (ascending)', icon: calendarArrowUp },
];

interface ExamSortDropdownProps {
    activeSortBy?: 'title' | 'questionsCount' | 'createdAt';
    activeSortOrder?: 'asc' | 'desc';
    onSort: (sortBy: 'title' | 'questionsCount' | 'createdAt', sortOrder: 'asc' | 'desc') => void;
    open: boolean;
    onToggle: () => void;
}

export function ExamSortDropdown({ activeSortBy, activeSortOrder, onSort, open, onToggle }: ExamSortDropdownProps) {
    return (
        <div className="relative flex justify-end">
            <button type="button" onClick={onToggle}>
                <img src={descriptionIcon} alt="Sort" className="h-[36px] w-[80px]" />
            </button>
            {open && (
                <div className="absolute top-full right-0 z-20 mt-1 w-[250px] border border-gray-200 bg-white shadow-md">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.label}
                            type="button"
                            onClick={() => onSort(option.sortBy, option.sortOrder)}
                            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50 ${activeSortBy === option.sortBy && activeSortOrder === option.sortOrder ? 'bg-blue-50 font-medium' : ''
                                }`}
                        >
                            <img src={option.icon} alt="" className="h-4 w-4" />
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
