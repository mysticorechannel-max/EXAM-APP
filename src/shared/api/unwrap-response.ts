/**
 * Utility to safely unwrap API responses that may come in different shapes.
 * Handles both wrapped ({ status, code, payload: { ... } }) and direct response formats.
 */

interface WrappedPayload<T> {
    status?: boolean;
    code?: number;
    payload?: T;
}

/**
 * Unwraps a potentially wrapped API response to get the payload.
 * Handles: { payload: T } | T
 */
export function unwrapPayload<T>(data: unknown): T {
    if (
        typeof data === 'object' &&
        data !== null &&
        'payload' in data &&
        (data as WrappedPayload<T>).payload !== undefined
    ) {
        return (data as WrappedPayload<T>).payload as T;
    }
    return data as T;
}

/**
 * Extracts a specific field from a potentially wrapped response.
 * Example: unwrapField(data, 'exam') handles:
 *   { payload: { exam } } | { exam } | exam itself
 */
export function unwrapField<T>(data: unknown, field: string): T {
    const unwrapped = unwrapPayload<Record<string, unknown>>(data);

    if (
        typeof unwrapped === 'object' &&
        unwrapped !== null &&
        field in unwrapped
    ) {
        return unwrapped[field] as T;
    }

    return unwrapped as T;
}
