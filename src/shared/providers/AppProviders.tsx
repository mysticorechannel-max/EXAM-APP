import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/shared/lib/query-client';
import { ErrorBoundary } from '@/shared/components';

interface AppProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        width: '400px',
                        minHeight: '47px',
                        backgroundColor: '#1F2937',
                        color: '#fff',
                        padding: '16px',
                        gap: '10px',
                        borderRadius: '5px',
                        fontFamily: 'Geist Mono, monospace',
                        fontSize: '13px',
                    },
                }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
