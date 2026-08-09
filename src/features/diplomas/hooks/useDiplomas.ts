import { useQuery } from '@tanstack/react-query';
import { diplomasApi, type DiplomasParams } from '../apis/diplomas.api';
import { unwrapPayload } from '@/shared/api/unwrap-response';
import type { Diploma } from '../types/diploma.types';
import type { PaginatedPayload } from '@/shared/types';

export function useDiplomas(params?: DiplomasParams) {
    return useQuery({
        queryKey: ['diplomas', params],
        queryFn: async (): Promise<PaginatedPayload<Diploma>> => {
            const res = await diplomasApi.getAll(params);
            return unwrapPayload<PaginatedPayload<Diploma>>(res.data);
        },
    });
}
