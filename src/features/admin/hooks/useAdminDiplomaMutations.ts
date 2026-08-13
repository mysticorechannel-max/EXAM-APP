import { useMutation, useQueryClient } from '@tanstack/react-query';
import { diplomasApi, type CreateDiplomaBody, type UpdateDiplomaBody } from '@/features/diplomas/apis/diplomas.api';

export function useCreateDiploma() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateDiplomaBody) => diplomasApi.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-diplomas'] });
            queryClient.invalidateQueries({ queryKey: ['diplomas'] });
        },
    });
}

export function useUpdateDiploma() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: UpdateDiplomaBody }) =>
            diplomasApi.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-diplomas'] });
            queryClient.invalidateQueries({ queryKey: ['diplomas'] });
        },
    });
}

export function useDeleteDiploma() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => diplomasApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-diplomas'] });
            queryClient.invalidateQueries({ queryKey: ['diplomas'] });
        },
    });
}

export function useToggleDiplomaImmutable() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, immutable }: { id: string; immutable: boolean }) =>
            diplomasApi.toggleImmutable(id, immutable),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-diplomas'] });
            queryClient.invalidateQueries({ queryKey: ['diplomas'] });
        },
    });
}
