import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../apis/users.api';
import { authService } from '@/features/auth/services/auth.service';

export function useDeleteAccount() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => usersApi.deleteAccount(),
        onSuccess: () => {
            authService.clearAuthData();
            navigate('/auth/login');
        },
    });
}
