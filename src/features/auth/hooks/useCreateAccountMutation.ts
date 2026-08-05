import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
import type { SendEmailVerificationRequest } from '../types/auth.types';

export function useCreateAccountMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: SendEmailVerificationRequest) =>
            authApi.sendEmailVerification(data).then((res) => res.data),
        onSuccess: (_data, variables) => {
            navigate('/auth/verify-email', { state: { email: variables.email } });
        },
    });
}
