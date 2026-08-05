import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
export function useUserInfoMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data) => Promise.resolve(data),
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
