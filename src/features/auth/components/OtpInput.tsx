import { useRef, useCallback } from 'react';
import { cn } from '@/shared/utils';

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
    hasError?: boolean;
}

export function OtpInput({
    value,
    onChange,
    length = 6,
    disabled = false,
    hasError = false,
}: OtpInputProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

    const focusInput = useCallback((index: number) => {
        const input = inputsRef.current[index];
        if (input) input.focus();
    }, []);

    const handleChange = (index: number, char: string) => {
        if (!/^\d?$/.test(char)) return;

        const newDigits = [...digits];
        newDigits[index] = char;
        const newValue = newDigits.join('').slice(0, length);
        onChange(newValue);

        if (char && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!digits[index] && index > 0) {
                focusInput(index - 1);
                const newDigits = [...digits];
                newDigits[index - 1] = '';
                onChange(newDigits.join(''));
            } else {
                const newDigits = [...digits];
                newDigits[index] = '';
                onChange(newDigits.join(''));
            }
            e.preventDefault();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (pasted) {
            onChange(pasted);
            focusInput(Math.min(pasted.length, length - 1));
        }
    };

    return (
        <div className="flex gap-2 xl:gap-3">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputsRef.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={cn(
                        'h-[44px] w-[44px] rounded-lg border bg-background text-center font-[Geist_Mono] text-[18px] font-semibold xl:h-[52px] xl:w-[52px] xl:text-[20px]',
                        'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        hasError ? 'border-destructive' : 'border-input'
                    )}
                    aria-label={`Digit ${index + 1}`}
                />
            ))}
        </div>
    );
}
