import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../apis/exams.api';
import { unwrapField } from '@/shared/api/unwrap-response';
import type { Exam } from '../types/exam.types';

export function useExamDetails(examId: string) {
    return useQuery({
        queryKey: ['exams', examId],
        queryFn: async (): Promise<Exam> => {
            const res = await examsApi.getById(examId);
            return unwrapField<Exam>(res.data, 'exam');
        },
        enabled: !!examId,
    });
}
