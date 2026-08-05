import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from './Spinner';
export function Loader({ message = 'Loading...' }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[300px] gap-3", children: [_jsx(Spinner, { size: "lg" }), _jsx("p", { className: "text-sm text-muted-foreground", children: message })] }));
}
