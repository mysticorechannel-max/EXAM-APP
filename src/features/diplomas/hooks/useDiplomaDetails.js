import { useQuery } from '@tanstack/react-query';
import { diplomasApi } from '../apis/diplomas.api';
export function useDiplomaDetails(id) {
    return useQuery({
        queryKey: ['diplomas', id],
        queryFn: async () => {
            const res = await diplomasApi.getById(id);
            // Handle both wrapped ({ payload: { diploma } }) and unwrapped ({ diploma }) response
            const data = res.data;
            if (data.payload?.diploma)
                return data.payload.diploma;
            if (data.payload)
                return data.payload;
            if (data.diploma)
                return data.diploma;
            return data;
        },
        enabled: !!id,
    });
}
