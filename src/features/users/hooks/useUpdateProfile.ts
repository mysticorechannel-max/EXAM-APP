import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../apis/users.api';
import type { UserProfile } from '../types/user.types';

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { firstName?: string; lastName?: string; phone?: string; profilePhoto?: string }) =>
            usersApi.updateProfile(data),
        onSuccess: (_response, variables) => {
            // Update the cache directly with submitted values.
            // The backend GET /users/profile may not return phone correctly,
            // so we merge the submitted values into the existing cache.
            queryClient.setQueryData<UserProfile>(['users', 'profile'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    firstName: variables.firstName ?? old.firstName,
                    lastName: variables.lastName ?? old.lastName,
                    phone: variables.phone ?? old.phone,
                };
            });
        },
    });
}
