import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AuthBranding } from './AuthBranding';
export function AuthLayout({ children }) {
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsx("div", { className: "hidden lg:flex lg:w-[45%] xl:w-1/2", children: _jsx("div", { className: "flex w-full bg-[#EFF6FF]/75 backdrop-blur-[200px] lg:px-8 lg:py-16 xl:px-12 xl:py-[116px]", children: _jsx(AuthBranding, {}) }) }), _jsx("div", { className: "flex w-full items-center justify-center px-6 py-10 lg:w-[55%] xl:w-1/2", children: children })] }));
}
