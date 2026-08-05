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

function LazyRoute({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            {children}
        </Suspense>
    );
}

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/auth/login" replace />,
            },
            {
                path: 'auth/*',
                element: (
                    <LazyRoute>
                        <AuthRoutes />
                    </LazyRoute>
                ),
            },
            {
                path: 'dashboard',
                element: <AuthGuard />,
                children: [
                    {
                        element: <DashboardLayout />,
                        children: [
                            {
                                index: true,
                                element: (
                                    <Navigate to="/dashboard/diplomas" replace />
                                ),
                            },
                            {
                                path: 'diplomas',
                                element: <DiplomasPage />,
                            },
                            {
                                path: 'diplomas/:id',
                                element: <DiplomaDetailsPage />,
                            },
                            {
                                path: 'diplomas/:diplomaId/exams',
                                element: <ExamsPage />,
                            },
                            {
                                path: 'exams/:examId/quiz',
                                element: <QuizPage />,
                            },
                            {
                                path: 'exams/:examId/results',
                                element: <ResultsPage />,
                            },
                            {
                                path: 'account',
                                element: <AccountSettingsPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
