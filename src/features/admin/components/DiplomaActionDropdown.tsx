import { Eye, Pencil, Trash2 } from 'lucide-react';

interface DiplomaActionDropdownProps {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function DiplomaActionDropdown({ onView, onEdit, onDelete }: DiplomaActionDropdownProps) {
    return (
        <div className="absolute top-full right-0 z-20 mt-1 w-[140px] border border-gray-200 bg-white py-2 shadow-md">
            <button
                type="button"
                onClick={onView}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-800 hover:bg-gray-50"
            >
                <Eye className="h-[18px] w-[18px] text-[#16A34A]" />
                View
            </button>
            <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-gray-800 hover:bg-gray-50"
            >
                <Pencil className="h-[18px] w-[18px] text-[#155DFC]" />
                Edit
            </button>
            <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-[Geist_Mono] text-sm text-[#DC2626] hover:bg-gray-50"
            >
                <Trash2 className="h-[18px] w-[18px] text-[#DC2626]" />
                Delete
            </button>
        </div>
    );
}
