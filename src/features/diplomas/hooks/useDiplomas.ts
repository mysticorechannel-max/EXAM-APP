import { useQuery } from '@tanstack/react-query';
import { diplomasApi, type DiplomasParams } from '../apis/diplomas.api';

export function useDiplomas(params?: DiplomasParams) {
    return useQuery({
        queryKey: ['diplomas', params],
        queryFn: async () => {
            const res = await diplomasApi.getAll(params);
            return res.data.payload;
        },
    });
}
