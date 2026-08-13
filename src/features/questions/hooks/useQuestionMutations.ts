import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi, type CreateQuestionBody, type UpdateQuestionBody } from '../apis/questions.api';

export function useCreateQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: CreateQuestionBody) => questionsApi.create(body),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['questions', variables.examId] });
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exam'] });
        },
    });
}

export function useUpdateQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: UpdateQuestionBody }) => questionsApi.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
}

export function useDeleteQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => questionsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exam'] });
        },
    });
}
