import { Spinner } from './Spinner';

interface LoaderProps {
    message?: string;
}

export function Loader({ message = 'Loading...' }: LoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}
