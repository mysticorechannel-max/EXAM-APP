import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auditApi } from '../apis/audit.api';

export function useDeleteAuditLog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => auditApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
        },
    });
}

export function useClearAllAuditLogs() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => auditApi.clearAll(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
        },
    });
}
