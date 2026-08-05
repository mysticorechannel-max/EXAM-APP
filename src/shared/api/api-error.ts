export interface ApiFieldError {
    field: string;
    message: string;
}

export interface ApiError {
    message: string;
    status: number;
    code: string;
    fieldErrors?: ApiFieldError[];
}

export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        'status' in error &&
        'code' in error
    );
}
