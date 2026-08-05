import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../apis/users.api';

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { firstName?: string; lastName?: string; phone?: string; profilePhoto?: string }) =>
            usersApi.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
        },
    });
}
