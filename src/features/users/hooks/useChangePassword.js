import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../apis/users.api';
export function useChangePassword() {
    return useMutation({
        mutationFn: (data) => usersApi.changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        }),
    });
}
