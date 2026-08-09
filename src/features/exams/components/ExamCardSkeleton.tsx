export function ExamCardSkeleton() {
    return (
        <div className="flex animate-pulse gap-4 rounded-[8px] border border-gray-100 bg-[#F8F9FA] p-4">
            <div className="h-[72px] w-[72px] flex-shrink-0 rounded-[8px] bg-gray-200" />
            <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between">
                    <div className="h-4 w-1/4 rounded bg-gray-200" />
                    <div className="flex gap-3">
                        <div className="h-3 w-20 rounded bg-gray-200" />
                        <div className="h-3 w-16 rounded bg-gray-200" />
                    </div>
                </div>
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-4/5 rounded bg-gray-200" />
                <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
        </div>
    );
}
