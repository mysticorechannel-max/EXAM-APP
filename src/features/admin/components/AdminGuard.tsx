import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '@/features/auth/services/auth.service';

/**
 * Protects admin routes. Only ADMIN and SUPER_ADMIN roles can access.
 * Redirects unauthenticated users to login.
 * Redirects authenticated non-admin users to the student dashboard.
 */
export function AdminGuard() {
    if (!authService.isAuthenticated()) {
        authService.clearAuthData();
        return <Navigate to="/auth/login" replace />;
    }

    const stored = localStorage.getItem('user');
    if (!stored) {
        return <Navigate to="/auth/login" replace />;
    }

    try {
        const user = JSON.parse(stored);
        const role: string = user.role || '';
        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
            return <Navigate to="/dashboard/diplomas" replace />;
        }
    } catch {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
}
