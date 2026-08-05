import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../apis/exams.api';
export function useExamDetails(id) {
    return useQuery({
        queryKey: ['exams', id],
        queryFn: async () => {
            const res = await examsApi.getById(id);
            const data = res.data;
            if (data.payload?.exam)
                return data.payload.exam;
            if (data.exam)
                return data.exam;
            return data;
        },
        enabled: !!id,
    });
}
