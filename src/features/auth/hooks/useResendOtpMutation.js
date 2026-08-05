import { useMutation } from '@tanstack/react-query';
import { authApi } from '../apis/auth.api';
export function useResendOtpMutation() {
    return useMutation({
        mutationFn: (data) => authApi.sendEmailVerification(data).then((res) => res.data),
    });
}
