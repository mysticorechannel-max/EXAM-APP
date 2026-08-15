import { apiClient } from '@/shared/api';
import type { ApiEnvelope, PaginatedPayload } from '@/shared/types';
import type { AuditLog, AuditLogsParams } from '../types/audit.types';

export const auditApi = {
    getAll: (params?: AuditLogsParams) =>
        apiClient.get<ApiEnvelope<PaginatedPayload<AuditLog>>>('/admin/audit-logs', { params }),

    getById: (id: string) =>
        apiClient.get<ApiEnvelope<{ auditLog: AuditLog }>>(`/admin/audit-logs/${id}`),

    delete: (id: string) =>
        apiClient.delete<{ status: boolean; code: number; message: string }>(`/admin/audit-logs/${id}`),

    clearAll: () =>
        apiClient.delete<ApiEnvelope<{ deletedCount: number }>>('/admin/audit-logs'),
};
