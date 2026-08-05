import { apiClient } from '@/shared/api';
export const authApi = {
    login: (data) => apiClient.post('/auth/login', data),
    sendEmailVerification: (data) => apiClient.post('/auth/send-email-verification', data),
    confirmEmailVerification: (data) => apiClient.post('/auth/confirm-email-verification', data),
    register: (data) => apiClient.post('/auth/register', data),
    forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
    resetPassword: (data) => apiClient.post('/auth/reset-password', data),
};
