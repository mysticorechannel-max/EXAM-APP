function getEnvVar(key: string, fallback?: string): string {
    const value = import.meta.env[key] as string | undefined;
    if (!value) {
        if (fallback !== undefined) return fallback;
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const env = {
    VITE_API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'https://exam-app.elevate-bootcamp.cloud/api'),
} as const;
