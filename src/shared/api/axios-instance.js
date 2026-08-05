import axios from 'axios';
import { env } from '@/shared/lib/env';
export const apiClient = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor — attach auth token when available
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token && token !== 'undefined' && token !== 'null' && token.length >= 10) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
function extractFieldErrors(data) {
    if (!data?.errors)
        return [];
    if (Array.isArray(data.errors)) {
        return data.errors.map((e) => ({
            field: Array.isArray(e.path) ? e.path.join('.') : (e.path ?? e.field ?? ''),
            message: e.message ?? e.msg ?? '',
        }));
    }
    return Object.entries(data.errors).map(([field, value]) => ({
        field,
        message: Array.isArray(value) ? value.join(', ') : value,
    }));
}
function buildMessage(data, fallback) {
    if (!data)
        return fallback;
    if (typeof data.message === 'string' && data.message.trim())
        return data.message;
    if (Array.isArray(data.message) && data.message.length)
        return data.message.join(', ');
    if (typeof data.error === 'string' && data.error.trim())
        return data.error;
    const fieldErrors = extractFieldErrors(data);
    if (fieldErrors.length) {
        return fieldErrors.map((fe) => (fe.field ? `${fe.field}: ${fe.message}` : fe.message)).join(' | ');
    }
    return fallback;
}
// Response interceptor — normalize errors + handle 401
apiClient.interceptors.response.use((response) => response, (error) => {
    const data = error.response?.data;
    // Auto-logout on 401 only when on a protected dashboard route
    if (error.response?.status === 401) {
        if (window.location.pathname.startsWith('/dashboard')) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
            return Promise.reject(error);
        }
    }
    const normalizedError = {
        message: buildMessage(data, error.message ?? 'An unexpected error occurred'),
        status: error.response?.status ?? 0,
        code: error.code ?? 'UNKNOWN_ERROR',
        fieldErrors: extractFieldErrors(data),
    };
    return Promise.reject(normalizedError);
});
