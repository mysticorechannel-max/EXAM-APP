import { apiClient } from '@/shared/api';
export const diplomasApi = {
    getAll: (params) => apiClient.get('/diplomas', { params }),
    getById: (id) => apiClient.get(`/diplomas/${id}`),
};
