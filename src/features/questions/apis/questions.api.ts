import { apiClient } from '@/shared/api';
import type { QuestionsResponse } from '../types/question.types';

export const questionsApi = {
    getByExamId: (examId: string) =>
        apiClient.get<QuestionsResponse>(`/questions/exam/${examId}`),
};
