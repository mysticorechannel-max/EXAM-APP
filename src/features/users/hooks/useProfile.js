import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../apis/users.api';
export function useProfile() {
    return useQuery({
        queryKey: ['users', 'profile'],
        queryFn: async () => {
            const res = await usersApi.getProfile();
            return res.data.user;
        },
    });
}
