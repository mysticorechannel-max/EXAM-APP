/**
 * Returns the current user's role from localStorage.
 * Possible values: 'ADMIN' | 'SUPER_ADMIN' | 'USER' | ''
 */
export function getUserRole(): string {
    try {
        const stored = localStorage.getItem('user');
        if (!stored) return '';
        const user = JSON.parse(stored);
        return user.role || '';
    } catch {
        return '';
    }
}

export function isSuperAdmin(): boolean {
    return getUserRole() === 'SUPER_ADMIN';
}
