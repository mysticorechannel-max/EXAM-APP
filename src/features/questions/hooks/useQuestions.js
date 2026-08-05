import { useQuery } from '@tanstack/react-query';
import { questionsApi } from '../apis/questions.api';
export function useQuestions(examId) {
    return useQuery({
        queryKey: ['questions', examId],
        queryFn: async () => {
            const res = await questionsApi.getByExamId(examId);
            const data = res.data;
            // Handle wrapped response { status, code, payload: { questions } }
            if (data.payload?.questions)
                return data.payload.questions;
            if (data.questions)
                return data.questions;
            return [];
        },
        enabled: !!examId,
    });
}
