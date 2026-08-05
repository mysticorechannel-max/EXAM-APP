import { apiClient } from '@/shared/api';
import type { UserProfile } from '../types/user.types';

interface ProfileResponse {
    user: UserProfile;
}

export const usersApi = {
    getProfile: () => apiClient.get<ProfileResponse>('/users/profile'),
    updateProfile: (data: { firstName?: string; lastName?: string; phone?: string; profilePhoto?: string }) =>
        apiClient.put<ProfileResponse>('/users/profile', data),
    changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
        apiClient.post('/users/change-password', data),
    deleteAccount: () => apiClient.delete('/users/account'),
};
