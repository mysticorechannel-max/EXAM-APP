import { apiClient } from '@/shared/api';
export const examsApi = {
    getAll: (params) => {
        return apiClient.get('/exams', { params });
    },
    getById: (id) => apiClient.get(`/exams/${id}`),
    submit: (data) => apiClient.post('/submissions', data),
};
