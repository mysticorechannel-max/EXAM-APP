import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
export function DiplomaCard({ diploma }) {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    return (_jsxs("button", { type: "button", onClick: () => navigate(`/dashboard/diplomas/${diploma.id}`), className: "group relative h-[448px] w-full overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", children: [diploma.image && !imgError ? (_jsx("img", { src: diploma.image, alt: diploma.title, onError: () => setImgError(true), className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" })) : (_jsx("div", { className: "flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200", children: _jsx(GraduationCap, { className: "h-16 w-16 text-blue-400" }) })), _jsxs("div", { className: "absolute inset-x-[10px] bottom-[10px] rounded-lg p-[16px]", style: {
                    backgroundColor: 'rgba(21, 93, 252, 0.75)',
                    backdropFilter: 'blur(12px)',
                }, children: [_jsx("h3", { className: "truncate text-left font-[Geist_Mono] text-sm font-semibold text-white", children: diploma.title }), _jsx("p", { className: "mt-[4px] line-clamp-2 text-left font-[Geist_Mono] text-xs text-white/80", children: diploma.description })] })] }));
}
