export function isApiError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        'status' in error &&
        'code' in error);
}
