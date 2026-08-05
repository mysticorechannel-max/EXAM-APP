export function ExamCardSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-4 border-b border-gray-200 bg-white px-4 py-4 last:border-b-0">
            <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200" />
            <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="h-3 w-32 rounded bg-gray-200" />
                <div className="h-7 w-20 rounded-lg bg-gray-200" />
            </div>
        </div>
    );
}
