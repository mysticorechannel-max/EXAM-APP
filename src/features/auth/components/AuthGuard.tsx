import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/auth.service';

export function AuthGuard() {
    if (!authService.isAuthenticated()) {
        // Clean up any stale invalid tokens
        authService.clearAuthData();
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
}
