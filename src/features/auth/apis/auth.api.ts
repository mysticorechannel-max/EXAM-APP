import { apiClient } from '@/shared/api';
import type { ApiEnvelope } from '@/shared/types';
import type {
    LoginRequest,
    AuthTokens,
    SendEmailVerificationRequest,
    SendEmailVerificationResponse,
    ConfirmEmailVerificationRequest,
    ConfirmEmailVerificationResponse,
    RegisterRequest,
    RegisterResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from '../types/auth.types';

export const authApi = {
    login: (data: LoginRequest) =>
        apiClient.post<ApiEnvelope<AuthTokens>>('/auth/login', data),

    sendEmailVerification: (data: SendEmailVerificationRequest) =>
        apiClient.post<SendEmailVerificationResponse>('/auth/send-email-verification', data),

    confirmEmailVerification: (data: ConfirmEmailVerificationRequest) =>
        apiClient.post<ConfirmEmailVerificationResponse>('/auth/confirm-email-verification', data),

    register: (data: RegisterRequest) =>
        apiClient.post<RegisterResponse>('/auth/register', data),

    forgotPassword: (data: ForgotPasswordRequest) =>
        apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', data),

    resetPassword: (data: ResetPasswordRequest) =>
        apiClient.post<ResetPasswordResponse>('/auth/reset-password', data),
};
