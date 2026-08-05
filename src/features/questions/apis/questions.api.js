import { apiClient } from '@/shared/api';
export const questionsApi = {
    getByExamId: (examId) => apiClient.get(`/questions/exam/${examId}`),
};
