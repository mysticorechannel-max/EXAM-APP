import { useQuery } from '@tanstack/react-query';
import { examsApi, type ExamsParams } from '../apis/exams.api';
import { unwrapPayload } from '@/shared/api/unwrap-response';
import type { Exam } from '../types/exam.types';
import type { PaginatedPayload } from '@/shared/types';

export function useExams(params?: ExamsParams) {
    return useQuery({
        queryKey: ['exams', params],
        queryFn: async (): Promise<PaginatedPayload<Exam>> => {
            const res = await examsApi.getAll(params);
            return unwrapPayload<PaginatedPayload<Exam>>(res.data);
        },
    });
}
