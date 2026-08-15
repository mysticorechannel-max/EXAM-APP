import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout, DashboardLayout, AdminLayout } from '@/shared/layouts';
import { Spinner } from '@/shared/components';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { AdminGuard } from '@/features/admin/components/AdminGuard';
import { AccountSettingsPage } from '@/features/users/routes/AccountSettingsPage';
import { DiplomasPage } from '@/features/diplomas/routes/DiplomasPage';
import { DiplomaDetailsPage } from '@/features/diplomas/routes/DiplomaDetailsPage';
import { ExamsPage } from '@/features/exams/routes/ExamsPage';
import { QuizPage } from '@/features/exams/routes/QuizPage';
import { ResultsPage } from '@/features/exams/routes/ResultsPage';
import { AdminDiplomasPage } from '@/features/admin/routes/AdminDiplomasPage';
import { AdminDiplomaViewPage } from '@/features/admin/routes/AdminDiplomaViewPage';
import { AdminDiplomaFormPage } from '@/features/admin/routes/AdminDiplomaFormPage';
import { AdminExamsPage } from '@/features/admin/routes/AdminExamsPage';
import { AdminExamViewPage } from '@/features/admin/routes/AdminExamViewPage';
import { AdminExamFormPage } from '@/features/admin/routes/AdminExamFormPage';
import { AdminQuestionViewPage } from '@/features/admin/routes/AdminQuestionViewPage';
import { AdminQuestionFormPage } from '@/features/admin/routes/AdminQuestionFormPage';
import { AdminQuestionBulkAddPage } from '@/features/admin/routes/AdminQuestionBulkAddPage';
import { AdminAuditLogsPage } from '@/features/admin/routes/AdminAuditLogsPage';
import { AdminAuditLogViewPage } from '@/features/admin/routes/AdminAuditLogViewPage';

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
                                element: <Navigate to="/dashboard/diplomas" replace />,
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
            {
                path: 'admin',
                element: <AdminGuard />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="/admin/diplomas" replace />,
                            },
                            {
                                path: 'diplomas',
                                element: <AdminDiplomasPage />,
                            },
                            {
                                path: 'diplomas/new',
                                element: <AdminDiplomaFormPage />,
                            },
                            {
                                path: 'diplomas/:id',
                                element: <AdminDiplomaViewPage />,
                            },
                            {
                                path: 'diplomas/:id/edit',
                                element: <AdminDiplomaFormPage />,
                            },
                            {
                                path: 'exams',
                                element: <AdminExamsPage />,
                            },
                            {
                                path: 'exams/new',
                                element: <AdminExamFormPage />,
                            },
                            {
                                path: 'exams/:id',
                                element: <AdminExamViewPage />,
                            },
                            {
                                path: 'exams/:id/edit',
                                element: <AdminExamFormPage />,
                            },
                            {
                                path: 'exams/:examId/questions/new',
                                element: <AdminQuestionFormPage />,
                            },
                            {
                                path: 'exams/:examId/questions/bulk-add',
                                element: <AdminQuestionBulkAddPage />,
                            },
                            {
                                path: 'exams/:examId/questions/:questionId',
                                element: <AdminQuestionViewPage />,
                            },
                            {
                                path: 'exams/:examId/questions/:questionId/edit',
                                element: <AdminQuestionFormPage />,
                            },
                            {
                                path: 'account-settings',
                                element: <AccountSettingsPage />,
                            },
                            {
                                path: 'audit-logs',
                                element: <AdminAuditLogsPage />,
                            },
                            {
                                path: 'audit-logs/:id',
                                element: <AdminAuditLogViewPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
