import { useQuery } from '@tanstack/react-query';
import { examsApi, type ExamsParams } from '../apis/exams.api';

export function useExams(params?: ExamsParams) {
    return useQuery({
        queryKey: ['exams', params],
        queryFn: async () => {
            const res = await examsApi.getAll(params);
            const data = res.data as any;
            // Handle different response formats
            if (data.payload) return data.payload;
            if (data.data) return { data: data.data, metadata: data.metadata || {} };
            if (Array.isArray(data)) return { data, metadata: {} };
            return data;
        },
    });
}
