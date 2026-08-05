import { useQuery } from '@tanstack/react-query';
import { questionsApi } from '../apis/questions.api';
import type { Question } from '../types/question.types';

export function useQuestions(examId: string) {
    return useQuery({
        queryKey: ['questions', examId],
        queryFn: async (): Promise<Question[]> => {
            const res = await questionsApi.getByExamId(examId);
            const data = res.data as {
                payload?: { questions?: Question[] };
                questions?: Question[];
            };
            // Handle wrapped response { status, code, payload: { questions } }
            if (data.payload?.questions) return data.payload.questions;
            if (data.questions) return data.questions;
            return [];
        },
        enabled: !!examId,
    });
}
