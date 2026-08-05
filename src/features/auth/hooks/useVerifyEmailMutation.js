import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
export function useVerifyEmailMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data) => authApi.confirmEmailVerification(data).then((res) => res.data),
        onSuccess: (_data, variables) => {
            navigate('/auth/user-info', { state: { email: variables.email } });
        },
    });
}
