import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
export function useForgotPasswordMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (data) => {
            const res = await authApi.forgotPassword(data);
            // If backend returns success but indicates email not found
            if (res.data && res.data.success === false) {
                throw { message: 'Email not found. Please check and try again.', status: 404, code: 'EMAIL_NOT_FOUND' };
            }
            return res.data;
        },
        onSuccess: (_data, variables) => {
            navigate('/auth/password-reset-sent', { state: { email: variables.email } });
        },
    });
}
