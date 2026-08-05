import { useQuery } from '@tanstack/react-query';
import { diplomasApi } from '../apis/diplomas.api';
export function useDiplomas(params) {
    return useQuery({
        queryKey: ['diplomas', params],
        queryFn: async () => {
            const res = await diplomasApi.getAll(params);
            return res.data.payload;
        },
    });
}
