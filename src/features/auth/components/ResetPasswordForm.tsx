import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/reset-password.schema';
import { useResetPasswordMutation } from '../hooks/useResetPasswordMutation';
import { isApiError } from '@/shared/api';
import type { ResetPasswordRequest } from '../types/auth.types';

export function ResetPasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const mutation = useResetPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        const payload: ResetPasswordRequest = {
            token,
            newPassword: data.password,
            confirmPassword: data.confirmPassword,
        };
        mutation.reset();
        mutation.mutate(payload);
    };

    const apiError =
        mutation.error && isApiError(mutation.error) ? mutation.error : null;

    const apiErrorMessage = apiError
        ? apiError.fieldErrors && apiError.fieldErrors.length > 0
            ? apiError.fieldErrors
                .map((fe) => (fe.field ? `${fe.field}: ${fe.message}` : fe.message))
                .join(' | ')
            : apiError.message
        : mutation.error
            ? 'Something went wrong'
            : null;

    return (
        <div className="w-full max-w-[380px] xl:max-w-[452px]">
            <h1 className="mb-2 font-sans text-[24px] font-bold text-foreground xl:text-[30px]">
                Create a New Password
            </h1>
            <p className="mb-4 font-[Geist_Mono] text-[13px] text-muted-foreground xl:mb-6 xl:text-[14px]">
                Create a new strong password for your account.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-5">
                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="password"
                        className="font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('password')}
                            className={cn(
                                'h-[40px] w-full rounded-lg border border-gray-200 p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]',
                                'placeholder:text-muted-foreground',
                                'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
                                'disabled:cursor-not-allowed disabled:opacity-50',
                                errors.password && 'border-destructive'
                            )}
                            disabled={mutation.isPending}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="h-[18px] w-[18px] xl:h-5 xl:w-5" /> : <Eye className="h-[18px] w-[18px] xl:h-5 xl:w-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="confirmPassword"
                        className="font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className={cn(
                                'h-[40px] w-full rounded-lg border border-gray-200 p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]',
                                'placeholder:text-muted-foreground',
                                'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
                                'disabled:cursor-not-allowed disabled:opacity-50',
                                errors.confirmPassword && 'border-destructive'
                            )}
                            disabled={mutation.isPending}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? <EyeOff className="h-[18px] w-[18px] xl:h-5 xl:w-5" /> : <Eye className="h-[18px] w-[18px] xl:h-5 xl:w-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Global API error alert */}
                {apiErrorMessage && (
                    <div className="relative rounded-lg border border-[#DC2626] bg-white px-4 pt-5 pb-3">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DC2626]">
                            <X className="h-3.5 w-3.5 text-[#DC2626]" />
                        </div>
                        <p className="text-center font-[Geist_Mono] text-[12px] font-medium text-[#DC2626] xl:text-[13px]">
                            {apiErrorMessage}
                        </p>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={cn(
                        'h-[46px] w-full rounded-lg bg-[#155DFC] font-[Geist_Mono] text-[14px] font-medium text-white',
                        'flex items-center justify-center',
                        'hover:bg-[#1250D4] transition-colors',
                        'disabled:opacity-70 disabled:cursor-not-allowed'
                    )}
                >
                    {mutation.isPending ? <Spinner size="sm" className="text-white" /> : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}
