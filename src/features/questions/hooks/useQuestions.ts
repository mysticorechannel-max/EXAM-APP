import { useQuery } from '@tanstack/react-query';
import { questionsApi } from '../apis/questions.api';
import { unwrapField } from '@/shared/api/unwrap-response';
import type { Question } from '../types/question.types';

export function useQuestions(examId: string) {
    return useQuery({
        queryKey: ['questions', examId],
        queryFn: async (): Promise<Question[]> => {
            const res = await questionsApi.getByExamId(examId);
            return unwrapField<Question[]>(res.data, 'questions');
        },
        enabled: !!examId,
    });
}
