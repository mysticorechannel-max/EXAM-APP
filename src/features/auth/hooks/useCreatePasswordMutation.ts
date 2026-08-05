import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../apis/auth.api';
import type { ApiError } from '@/shared/api';
import type { RegisterRequest } from '../types/auth.types';

interface CreatePasswordData {
    password: string;
    confirmPassword: string;
}

interface RegistrationState {
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    phone?: string;
}

export function useCreatePasswordMutation() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state as RegistrationState | null) ?? {};

    return useMutation({
        mutationFn: (data: CreatePasswordData) => {
            if (!state.email || !state.firstName || !state.lastName || !state.username) {
                const err: ApiError = {
                    message: 'Registration data is missing. Please restart the sign-up process.',
                    status: 0,
                    code: 'MISSING_REGISTRATION_DATA',
                };
                return Promise.reject(err);
            }

            const registerData: RegisterRequest = {
                firstName: state.firstName,
                lastName: state.lastName,
                username: state.username,
                email: state.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                phone: state.phone ?? '',
            };

            return authApi.register(registerData).then((res) => res.data);
        },
        onSuccess: () => {
            navigate('/auth/login');
        },
    });
}
