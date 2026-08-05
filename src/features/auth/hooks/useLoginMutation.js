import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
import { authService } from '../services/auth.service';
export function useLoginMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (data) => {
            const res = await authApi.login(data);
            const raw = res.data;
            // The backend wraps in { status, code, payload }.
            // payload may have { accessToken } or { token }.
            const payload = raw.payload;
            const accessToken = payload.accessToken ??
                payload.token ??
                '';
            const refreshToken = payload.refreshToken ?? '';
            const user = payload.user ?? {
                id: '',
                username: '',
                email: '',
                role: '',
            };
            return { accessToken, refreshToken, user };
        },
        onSuccess: (tokens) => {
            authService.saveAuthData(tokens);
            if (authService.isAuthenticated()) {
                navigate('/dashboard/diplomas');
            }
        },
    });
}
