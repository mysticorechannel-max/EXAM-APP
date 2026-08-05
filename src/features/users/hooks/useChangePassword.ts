import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../apis/users.api';
import type { ChangePasswordFormData } from '../schemas/change-password.schema';

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePasswordFormData) =>
            usersApi.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            }),
    });
}
