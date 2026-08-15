import { apiClient } from '@/shared/api';
import type { QuestionsResponse, Question } from '../types/question.types';

export interface CreateQuestionBody {
    text: string;
    examId: string;
    answers: { text: string; isCorrect: boolean }[];
}

export interface UpdateQuestionBody {
    text?: string;
    answers?: { text: string; isCorrect: boolean }[];
}

export const questionsApi = {
    getByExamId: (examId: string) =>
        apiClient.get<QuestionsResponse>(`/questions/exam/${examId}`),
    create: (body: CreateQuestionBody) =>
        apiClient.post<{ status: boolean; payload: { question: Question } }>('/questions', body),
    update: (id: string, body: UpdateQuestionBody) =>
        apiClient.put(`/questions/${id}`, body),
    delete: (id: string) =>
        apiClient.delete(`/questions/${id}`),
    toggleImmutable: (id: string, immutable: boolean) =>
        apiClient.patch(`/admin/questions/${id}/immutable`, { immutable }),
};
