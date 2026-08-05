import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    state = { hasError: false, error: null };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback)
                return this.props.fallback;
            return (_jsxs("div", { role: "alert", className: "flex flex-col items-center justify-center min-h-[400px] gap-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground", children: this.state.error?.message }), _jsx("button", { onClick: this.handleReset, className: "px-4 py-2 bg-primary text-primary-foreground rounded-md", children: "Try Again" })] }));
        }
        return this.props.children;
    }
}
