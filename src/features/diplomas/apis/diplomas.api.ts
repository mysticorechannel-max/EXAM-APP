import { apiClient } from '@/shared/api';
import type { ApiEnvelope, PaginatedPayload } from '@/shared/types';
import type { Diploma } from '../types/diploma.types';

export interface DiplomasParams {
    page?: number;
    limit?: number;
    search?: string;
}

interface DiplomaDetailResponse {
    status: boolean;
    code: number;
    payload: {
        diploma: Diploma;
    };
}

export const diplomasApi = {
    getAll: (params?: DiplomasParams) =>
        apiClient.get<ApiEnvelope<PaginatedPayload<Diploma>>>('/diplomas', { params }),
    getById: (id: string) =>
        apiClient.get<DiplomaDetailResponse>(`/diplomas/${id}`),
};
