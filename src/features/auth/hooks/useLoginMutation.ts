import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
import { authService } from '../services/auth.service';
import type { LoginRequest, AuthTokens } from '../types/auth.types';

export function useLoginMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const res = await authApi.login(data);
            const raw = res.data;

            // The backend wraps in { status, code, payload }.
            // payload may have { accessToken } or { token }.
            const payload = (raw.payload ?? {}) as unknown as Record<string, unknown>;

            const accessToken =
                (payload.accessToken as string) ??
                (payload.token as string) ??
                '';

            const refreshToken =
                (payload.refreshToken as string) ?? '';

            const user = (payload.user as AuthTokens['user']) ?? {
                id: '',
                username: '',
                email: '',
                role: '',
            };

            return { accessToken, refreshToken, user } as AuthTokens;
        },
        onSuccess: (tokens) => {
            // Clear all cached data from the previous session
            queryClient.clear();

            authService.saveAuthData(tokens);
            if (authService.isAuthenticated()) {
                const role = tokens.user?.role || '';
                if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
                    navigate('/admin/diplomas');
                } else {
                    navigate('/dashboard/diplomas');
                }
            }
        },
    });
}
