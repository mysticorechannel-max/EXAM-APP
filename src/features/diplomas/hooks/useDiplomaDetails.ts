import { useQuery } from '@tanstack/react-query';
import { diplomasApi } from '../apis/diplomas.api';
import { unwrapField } from '@/shared/api/unwrap-response';
import type { Diploma } from '../types/diploma.types';

export function useDiplomaDetails(id: string) {
    return useQuery({
        queryKey: ['diplomas', id],
        queryFn: async (): Promise<Diploma> => {
            const res = await diplomasApi.getById(id);
            return unwrapField<Diploma>(res.data, 'diploma');
        },
        enabled: !!id,
    });
}
