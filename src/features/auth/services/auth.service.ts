import type { AuthTokens } from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

function getValidToken(): string | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token || token === 'undefined' || token === 'null' || token.length < 10) {
        return null;
    }
    return token;
}

export const authService = {
    saveAuthData(data: AuthTokens): void {
        if (!data?.accessToken || data.accessToken.length < 10) {
            return;
        }
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        if (data.refreshToken && data.refreshToken.length > 5) {
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }
        if (data.user) {
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
    },

    clearAuthData(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getAccessToken(): string | null {
        return getValidToken();
    },

    isAuthenticated(): boolean {
        return !!getValidToken();
    },
};
