import { apiClient } from '@/shared/api';
import type { ApiEnvelope, PaginatedPayload } from '@/shared/types';
import type { Diploma } from '../types/diploma.types';

export interface DiplomasParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'title' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    immutable?: boolean;
}

export interface CreateDiplomaBody {
    title: string;
    description?: string;
    image?: string;
}

export interface UpdateDiplomaBody {
    title?: string;
    description?: string;
    image?: string;
}

interface DiplomaDetailResponse {
    status: boolean;
    code: number;
    payload: {
        diploma: Diploma;
    };
}

interface DiplomaWriteResponse {
    diploma: Diploma;
}

interface DiplomaDeleteResponse {
    message: string;
}

export const diplomasApi = {
    getAll: (params?: DiplomasParams) =>
        apiClient.get<ApiEnvelope<PaginatedPayload<Diploma>>>('/diplomas', { params }),
    getById: (id: string) =>
        apiClient.get<DiplomaDetailResponse>(`/diplomas/${id}`),
    create: (body: CreateDiplomaBody) =>
        apiClient.post<DiplomaWriteResponse>('/diplomas', body),
    update: (id: string, body: UpdateDiplomaBody) =>
        apiClient.put<DiplomaWriteResponse>(`/diplomas/${id}`, body),
    delete: (id: string) =>
        apiClient.delete<DiplomaDeleteResponse>(`/diplomas/${id}`),
    toggleImmutable: (id: string, immutable: boolean) =>
        apiClient.patch(`/admin/diplomas/${id}/immutable`, { immutable }),
};
