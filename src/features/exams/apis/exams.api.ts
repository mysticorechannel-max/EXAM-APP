import { apiClient } from '@/shared/api';
import type { ApiEnvelope, PaginatedPayload } from '@/shared/types';
import type { Exam, ExamDetailsResponse } from '../types/exam.types';
import type { SubmitExamRequest, SubmitExamResponse } from '../types/submission.types';

export interface ExamsParams {
    page?: number;
    limit?: number;
    diplomaId?: string;
    search?: string;
}

export const examsApi = {
    getAll: (params?: ExamsParams) => {
        return apiClient.get<ApiEnvelope<PaginatedPayload<Exam>>>('/exams', { params });
    },
    getById: (id: string) =>
        apiClient.get<ExamDetailsResponse>(`/exams/${id}`),
    submit: (data: SubmitExamRequest) =>
        apiClient.post<SubmitExamResponse>('/submissions', data),
};
