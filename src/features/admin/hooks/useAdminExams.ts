import { useQuery } from '@tanstack/react-query';
import { examsApi, type ExamsParams } from '@/features/exams/apis/exams.api';
import { unwrapPayload } from '@/shared/api/unwrap-response';
import type { Exam } from '@/features/exams/types/exam.types';
import type { PaginatedPayload } from '@/shared/types';

export function useAdminExams(params?: ExamsParams) {
    return useQuery({
        queryKey: ['admin-exams', params],
        queryFn: async (): Promise<PaginatedPayload<Exam>> => {
            const res = await examsApi.getAll(params);
            return unwrapPayload<PaginatedPayload<Exam>>(res.data);
        },
    });
}
