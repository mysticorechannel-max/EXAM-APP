import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi, type CreateExamBody, type UpdateExamBody } from '@/features/exams/apis/exams.api';

export function useCreateExam() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: CreateExamBody) => examsApi.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}

export function useUpdateExam() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: UpdateExamBody }) => examsApi.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}

export function useDeleteExam() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => examsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}

export function useToggleExamImmutable() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, immutable }: { id: string; immutable: boolean }) => examsApi.toggleImmutable(id, immutable),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}
