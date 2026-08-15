export interface AuditLog {
    id: string;
    createdAt: string;
    actorUserId: string;
    actorUsername: string;
    actorEmail: string;
    actorRole: string;
    category: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    httpMethod: string;
    path?: string;
}

export interface AuditLogsParams {
    page?: number;
    limit?: number;
    category?: string;
    action?: string;
    actorUserId?: string;
    sortBy?: 'action' | 'user' | 'entity' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
