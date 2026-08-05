import { useMutation } from '@tanstack/react-query';
import { authApi } from '../apis/auth.api';
import type { SendEmailVerificationRequest } from '../types/auth.types';

export function useResendOtpMutation() {
    return useMutation({
        mutationFn: (data: SendEmailVerificationRequest) =>
            authApi.sendEmailVerification(data).then((res) => res.data),
    });
}
