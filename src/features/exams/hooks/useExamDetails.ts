import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../apis/exams.api';
import { unwrapField } from '@/shared/api/unwrap-response';
import type { Exam } from '../types/exam.types';

export function useExamDetails(id: string) {
    return useQuery({
        queryKey: ['exam', id],
        queryFn: async (): Promise<Exam> => {
            const res = await examsApi.getById(id);
            return unwrapField<Exam>(res.data, 'exam');
        },
        enabled: !!id,
    });
}
