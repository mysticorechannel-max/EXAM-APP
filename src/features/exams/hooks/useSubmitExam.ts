import { useMutation } from '@tanstack/react-query';
import { examsApi } from '../apis/exams.api';
import { unwrapPayload } from '@/shared/api/unwrap-response';
import type { SubmitExamRequest, SubmitExamResult } from '../types/submission.types';

export function useSubmitExam() {
    return useMutation({
        mutationFn: async (data: SubmitExamRequest): Promise<SubmitExamResult> => {
            const res = await examsApi.submit(data);
            return unwrapPayload<SubmitExamResult>(res.data);
        },
    });
}
