import arrowDownAZ from '../../../lucideAdmin/arrow-down-a-z.svg';
import arrowUpAZ from '../../../lucideAdmin/arrow-up-a-z.svg';
import calendarArrowDown from '../../../lucideAdmin/calendar-arrow-down.svg';
import calendarArrowUp from '../../../lucideAdmin/calendar-arrow-up.svg';
import sortButtonIcon from '../../../lucideAdmin/Description.svg';

type SortByField = 'action' | 'user' | 'entity' | 'createdAt';

type SortOption = {
    sortBy: SortByField;
    sortOrder: 'asc' | 'desc';
    label: string;
    icon: string;
};

const SORT_OPTIONS: SortOption[] = [
    { sortBy: 'action', sortOrder: 'desc', label: 'Action (descending)', icon: arrowDownAZ },
    { sortBy: 'action', sortOrder: 'asc', label: 'Action (ascending)', icon: arrowUpAZ },
    { sortBy: 'user', sortOrder: 'desc', label: 'User (descending)', icon: arrowDownAZ },
    { sortBy: 'user', sortOrder: 'asc', label: 'User (ascending)', icon: arrowUpAZ },
    { sortBy: 'entity', sortOrder: 'desc', label: 'Entity (descending)', icon: arrowDownAZ },
    { sortBy: 'entity', sortOrder: 'asc', label: 'Entity (ascending)', icon: arrowUpAZ },
    { sortBy: 'createdAt', sortOrder: 'desc', label: 'Newest (descending)', icon: calendarArrowDown },
    { sortBy: 'createdAt', sortOrder: 'asc', label: 'Newest (ascending)', icon: calendarArrowUp },
];

interface AuditLogSortDropdownProps {
    activeSortBy?: SortByField;
    activeSortOrder?: 'asc' | 'desc';
    onSort: (sortBy: SortByField, sortOrder: 'asc' | 'desc') => void;
    open: boolean;
    onToggle: () => void;
}

export function AuditLogSortDropdown({
    activeSortBy,
    activeSortOrder,
    onSort,
    open,
    onToggle,
}: AuditLogSortDropdownProps) {
    return (
        <div className="relative flex justify-end" data-dropdown>
            <button type="button" onClick={onToggle}>
                <img src={sortButtonIcon} alt="Sort" className="h-[36px] w-[80px]" />
            </button>

            {open && (
                <div className="absolute top-full right-0 z-20 mt-1 w-[240px] border border-gray-200 bg-white shadow-md">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.label}
                            type="button"
                            onClick={() => onSort(option.sortBy, option.sortOrder)}
                            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50 ${activeSortBy === option.sortBy && activeSortOrder === option.sortOrder
                                ? 'bg-blue-50 font-medium'
                                : ''
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
