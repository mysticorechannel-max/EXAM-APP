import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout, DashboardLayout } from '@/shared/layouts';
import { Spinner } from '@/shared/components';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { AccountSettingsPage } from '@/features/users/routes/AccountSettingsPage';
import { DiplomasPage } from '@/features/diplomas/routes/DiplomasPage';
import { DiplomaDetailsPage } from '@/features/diplomas/routes/DiplomaDetailsPage';
import { ExamsPage } from '@/features/exams/routes/ExamsPage';
import { QuizPage } from '@/features/exams/routes/QuizPage';
import { ResultsPage } from '@/features/exams/routes/ResultsPage';
const AuthRoutes = lazy(() => import('@/features/auth/routes'));
function LazyRoute({ children }) {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "flex h-screen items-center justify-center", children: _jsx(Spinner, { size: "lg" }) }), children: children }));
}
export const router = createBrowserRouter([
    {
        element: _jsx(RootLayout, {}),
        children: [
            {
                path: '/',
                element: _jsx(Navigate, { to: "/auth/login", replace: true }),
            },
            {
                path: 'auth/*',
                element: (_jsx(LazyRoute, { children: _jsx(AuthRoutes, {}) })),
            },
            {
                path: 'dashboard',
                element: _jsx(AuthGuard, {}),
                children: [
                    {
                        element: _jsx(DashboardLayout, {}),
                        children: [
                            {
                                index: true,
                                element: (_jsx(Navigate, { to: "/dashboard/diplomas", replace: true })),
                            },
                            {
                                path: 'diplomas',
                                element: _jsx(DiplomasPage, {}),
                            },
                            {
                                path: 'diplomas/:id',
                                element: _jsx(DiplomaDetailsPage, {}),
                            },
                            {
                                path: 'diplomas/:diplomaId/exams',
                                element: _jsx(ExamsPage, {}),
                            },
                            {
                                path: 'exams/:examId/quiz',
                                element: _jsx(QuizPage, {}),
                            },
                            {
                                path: 'exams/:examId/results',
                                element: _jsx(ResultsPage, {}),
                            },
                            {
                                path: 'account',
                                element: _jsx(AccountSettingsPage, {}),
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
