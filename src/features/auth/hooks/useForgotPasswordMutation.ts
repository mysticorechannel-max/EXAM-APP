import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
import type { ForgotPasswordRequest } from '../types/auth.types';

export function useForgotPasswordMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (data: ForgotPasswordRequest) => {
            const res = await authApi.forgotPassword(data);
            const responseData = res.data as { success?: boolean };

            if (responseData.success === false) {
                throw new Error('Email not found. Please check and try again.');
            }

            return res.data;
        },
        onSuccess: (_data, variables) => {
            navigate('/auth/password-reset-sent', { state: { email: variables.email } });
        },
    });
}
