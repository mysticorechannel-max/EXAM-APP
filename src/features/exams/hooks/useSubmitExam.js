import { useMutation } from '@tanstack/react-query';
import { examsApi } from '../apis/exams.api';
export function useSubmitExam() {
    return useMutation({
        mutationFn: async (data) => {
            const res = await examsApi.submit(data);
            const responseData = res.data;
            // Handle wrapped response { status, code, payload: { submission, analytics } }
            if (responseData.payload)
                return responseData.payload;
            return responseData;
        },
    });
}
