import { useQuery } from '@tanstack/react-query';
import { diplomasApi, type DiplomasParams } from '@/features/diplomas/apis/diplomas.api';
import { unwrapPayload } from '@/shared/api/unwrap-response';
import type { Diploma } from '@/features/diplomas/types/diploma.types';
import type { PaginatedPayload } from '@/shared/types';

export function useAdminDiplomas(params?: DiplomasParams) {
    return useQuery({
        queryKey: ['admin-diplomas', params],
        queryFn: async (): Promise<PaginatedPayload<Diploma>> => {
            const res = await diplomasApi.getAll(params);
            return unwrapPayload<PaginatedPayload<Diploma>>(res.data);
        },
    });
}
