import { useMutation } from '@tanstack/react-query';
import { examsApi } from '../apis/exams.api';
import type { SubmitExamRequest } from '../types/submission.types';

export function useSubmitExam() {
    return useMutation({
        mutationFn: async (data: SubmitExamRequest) => {
            const res = await examsApi.submit(data);
            const responseData = res.data as any;
            // Handle wrapped response { status, code, payload: { submission, analytics } }
            if (responseData.payload) return responseData.payload;
            return responseData;
        },
    });
}
