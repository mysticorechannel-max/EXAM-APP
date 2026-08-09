import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../apis/users.api';
import { unwrapField } from '@/shared/api/unwrap-response';
import type { UserProfile } from '../types/user.types';

export function useProfile() {
    return useQuery({
        queryKey: ['users', 'profile'],
        queryFn: async (): Promise<UserProfile> => {
            const res = await usersApi.getProfile();
            const profile = unwrapField<UserProfile>(res.data, 'user');

            // Backend may not persist/return phone correctly.
            // Merge with localStorage backup if API returns empty phone.
            const phone = (profile.phone || '').trim();
            if (!phone || phone === 'null' || phone === 'undefined') {
                const savedPhone = localStorage.getItem('user_phone') || '';
                if (savedPhone) {
                    profile.phone = savedPhone;
                }
            }

            return profile;
        },
    });
}
