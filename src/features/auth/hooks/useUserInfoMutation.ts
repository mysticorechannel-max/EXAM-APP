import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface UserInfoData {
    firstName: string;
    lastName: string;
    username: string;
    phone: string;
    email: string;
}

export function useUserInfoMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: UserInfoData) => Promise.resolve(data),
        onSuccess: (variables) => {
            navigate('/auth/create-password', {
                state: {
                    email: variables.email,
                    firstName: variables.firstName,
                    lastName: variables.lastName,
                    username: variables.username,
                    phone: variables.phone,
                },
            });
        },
    });
}
