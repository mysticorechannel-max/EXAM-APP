import { apiClient } from '@/shared/api';
export const usersApi = {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data) => apiClient.put('/users/profile', data),
    changePassword: (data) => apiClient.post('/users/change-password', data),
    deleteAccount: () => apiClient.delete('/users/account'),
};
