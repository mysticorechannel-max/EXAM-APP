import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div
                    role="alert"
                    className="flex flex-col items-center justify-center min-h-[400px] gap-4"
                >
                    <h2 className="text-xl font-semibold">Something went wrong</h2>
                    <p className="text-muted-foreground">{this.state.error?.message}</p>
                    <button
                        onClick={this.handleReset}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
