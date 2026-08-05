import { jsx as _jsx } from "react/jsx-runtime";
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/shared/providers';
import { router } from './router';
export function App() {
    return (_jsx(AppProviders, { children: _jsx(RouterProvider, { router: router }) }));
}
