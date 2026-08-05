import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/auth.service';
export function AuthGuard() {
    if (!authService.isAuthenticated()) {
        // Clean up any stale invalid tokens
        authService.clearAuthData();
        return _jsx(Navigate, { to: "/auth/login", replace: true });
    }
    return _jsx(Outlet, {});
}
