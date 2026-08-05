function getEnvVar(key) {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
export const env = {
    VITE_API_BASE_URL: getEnvVar('VITE_API_BASE_URL'),
};
