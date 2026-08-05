export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface SendEmailVerificationRequest {
    email: string;
}

export interface SendEmailVerificationResponse {
    message: string;
}

export interface ConfirmEmailVerificationRequest {
    email: string;
    code: string;
}

export interface ConfirmEmailVerificationResponse {
    message: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

export interface RegisterResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
    redirectUrl: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
}
