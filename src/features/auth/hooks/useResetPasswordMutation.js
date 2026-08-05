import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
export function useResetPasswordMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data) => authApi.resetPassword(data).then((res) => res.data),
        onSuccess: () => {
            navigate('/auth/login');
        },
    });
}
