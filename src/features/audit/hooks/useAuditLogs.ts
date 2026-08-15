import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../apis/audit.api';
import { unwrapPayload } from '@/shared/api/unwrap-response';
import type { AuditLog, AuditLogsParams } from '../types/audit.types';
import type { PaginatedPayload } from '@/shared/types';

export function useAuditLogs(params?: AuditLogsParams) {
    return useQuery({
        queryKey: ['admin-audit-logs', params],
        queryFn: async (): Promise<PaginatedPayload<AuditLog>> => {
            const res = await auditApi.getAll(params);
            return unwrapPayload<PaginatedPayload<AuditLog>>(res.data);
        },
    });
}
