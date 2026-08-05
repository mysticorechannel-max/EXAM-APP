import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
import type { ResetPasswordRequest } from '../types/auth.types';

export function useResetPasswordMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: ResetPasswordRequest) =>
            authApi.resetPassword(data).then((res) => res.data),
        onSuccess: () => {
            navigate('/auth/login');
        },
    });
}
