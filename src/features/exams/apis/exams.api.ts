import { apiClient } from '@/shared/api';
import type { ApiEnvelope, PaginatedPayload } from '@/shared/types';
import type { Exam, ExamDetailsResponse } from '../types/exam.types';
import type { SubmitExamRequest, SubmitExamResponse } from '../types/submission.types';

export interface ExamsParams {
    page?: number;
    limit?: number;
    diplomaId?: string;
    search?: string;
    sortBy?: 'title' | 'questionsCount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    immutable?: boolean;
}

export interface CreateExamBody {
    title: string;
    description?: string;
    image?: string;
    duration: number;
    diplomaId: string;
}

export interface UpdateExamBody {
    title?: string;
    description?: string;
    image?: string;
    duration?: number;
    diplomaId?: string;
}

export const examsApi = {
    getAll: (params?: ExamsParams) => {
        return apiClient.get<ApiEnvelope<PaginatedPayload<Exam>>>('/exams', { params });
    },
    getById: (id: string) =>
        apiClient.get<ExamDetailsResponse>(`/exams/${id}`),
    create: (body: CreateExamBody) =>
        apiClient.post('/exams', body),
    update: (id: string, body: UpdateExamBody) =>
        apiClient.patch(`/exams/${id}`, body),
    delete: (id: string) =>
        apiClient.delete(`/exams/${id}`),
    toggleImmutable: (id: string, immutable: boolean) =>
        apiClient.patch(`/admin/exams/${id}/immutable`, { immutable }),
    submit: (data: SubmitExamRequest) =>
        apiClient.post<SubmitExamResponse>('/submissions', data),
};
