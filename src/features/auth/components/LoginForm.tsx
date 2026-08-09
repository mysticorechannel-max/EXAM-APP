import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { isApiError } from '@/shared/api';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const loginMutation = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: '', password: '' },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.reset();
        loginMutation.mutate(data);
    };

    const apiErrorMessage = loginMutation.error
        ? isApiError(loginMutation.error)
            ? loginMutation.error.message
            : 'Something went wrong'
        : null;

    return (
        <div className="w-full max-w-[380px] xl:max-w-[452px]">
            <h1 className="mb-4 font-sans text-[24px] font-bold text-foreground xl:mb-6 xl:text-[30px]">
                Login
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 xl:gap-4">
                {/* Username */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="username"
                        className="font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        placeholder="user123"
                        {...register('username')}
                        className={cn(
                            'h-[40px] w-full rounded-lg border p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]',
                            'placeholder:text-muted-foreground',
                            'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            errors.username ? 'border-destructive' : 'border-input'
                        )}
                        disabled={loginMutation.isPending}
                    />
                    {errors.username && (
                        <p className="font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="password"
                        className="font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('password')}
                            className={cn(
                                'h-[40px] w-full rounded-lg border p-[10px] pr-12 font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]',
                                'placeholder:text-muted-foreground',
                                'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
                                'disabled:cursor-not-allowed disabled:opacity-50',
                                errors.password ? 'border-destructive' : 'border-input'
                            )}
                            disabled={loginMutation.isPending}
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

                {/* Forgot password */}
                <div className="flex justify-end">
                    <Link
                        to="/auth/forgot-password"
                        className="font-[Geist_Mono] text-[13px] font-medium text-blue-600 hover:underline xl:text-[14px]"
                    >
                        Forgot your password?
                    </Link>
                </div>

                {/* Global error alert */}
                {(apiErrorMessage || Object.keys(errors).length > 0) && (
                    <div className="relative rounded-lg border border-[#DC2626] bg-[#FEF2F2] px-4 pt-5 pb-3">
                        {/* Icon centered on top border */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                            <XCircle className="h-6 w-6 text-[#DC2626]" />
                        </div>
                        <p className="text-center font-[Geist_Mono] text-[12px] font-medium text-[#DC2626] xl:text-[13px]">
                            {apiErrorMessage || 'Something went wrong'}
                        </p>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className={cn(
                        'h-[46px] w-full rounded-lg bg-[#155DFC] font-[Geist_Mono] text-[14px] font-medium text-white',
                        'flex items-center justify-center',
                        'hover:bg-[#1250D4] transition-colors',
                        'disabled:opacity-70 disabled:cursor-not-allowed'
                    )}
                >
                    {loginMutation.isPending ? <Spinner size="sm" className="text-white" /> : 'Login'}
                </button>
            </form>

            {/* Create account */}
            <p className="mt-5 text-center font-[Geist_Mono] text-[13px] font-medium text-muted-foreground xl:mt-6 xl:text-[14px]">
                Don&apos;t have an account?{' '}
                <Link to="/auth/register" className="text-blue-600 hover:underline">
                    Create yours
                </Link>
            </p>
        </div>
    );
}
