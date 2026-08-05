import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/shared/lib/query-client';
import { ErrorBoundary } from '@/shared/components';
export function AppProviders({ children }) {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(ErrorBoundary, { children: children }), _jsx(Toaster, { position: "top-right", toastOptions: {
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
                } }), _jsx(ReactQueryDevtools, { initialIsOpen: false })] }));
}
