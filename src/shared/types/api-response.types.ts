/**
 * Standard API response envelope used across the backend.
 * List endpoints wrap data in: { status, code, payload: { data, metadata } }
 */
export interface ApiEnvelope<T> {
    status: boolean;
    code: number;
    payload: T;
}

export interface PaginationMetadata {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedPayload<T> {
    data: T[];
    metadata: PaginationMetadata;
}
