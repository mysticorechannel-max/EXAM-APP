import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
export function useCreateAccountMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data) => authApi.sendEmailVerification(data).then((res) => res.data),
        onSuccess: (_data, variables) => {
            navigate('/auth/verify-email', { state: { email: variables.email } });
        },
    });
}
