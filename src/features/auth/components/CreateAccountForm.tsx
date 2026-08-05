import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { Spinner } from '@/shared/components';
import { createAccountSchema, type CreateAccountFormData } from '../schemas/create-account.schema';
import { useCreateAccountMutation } from '../hooks/useCreateAccountMutation';
import { isApiError } from '@/shared/api';

export function CreateAccountForm() {
    const mutation = useCreateAccountMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: { email: '' },
    });

    const onSubmit = (data: CreateAccountFormData) => {
        mutation.reset();
        mutation.mutate(data);
    };

    const apiErrorMessage = mutation.error
        ? isApiError(mutation.error)
            ? mutation.error.message
            : 'Something went wrong'
        : null;

    return (
        <div className="w-full max-w-[380px] xl:max-w-[452px]">
            <h1 className="mb-2 font-sans text-[24px] font-bold text-foreground xl:text-[30px]">
                Create Account
            </h1>
            <p className="mb-6 font-[Geist_Mono] text-[13px] text-muted-foreground xl:mb-8 xl:text-[14px]">
                Enter your email to get started
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="email"
                        className="font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        className={cn(
                            'h-[40px] w-full rounded-lg border p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]',
                            'placeholder:text-muted-foreground',
                            'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            errors.email ? 'border-destructive' : 'border-input'
                        )}
                        disabled={mutation.isPending}
                    />
                    {errors.email && (
                        <p className="font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Global API error alert */}
                {apiErrorMessage && (
                    <div className="relative rounded-lg border border-[#DC2626] bg-white px-4 pt-5 pb-3">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DC2626]">
                            <AlertCircle className="h-3.5 w-3.5 text-[#DC2626]" />
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
                        'h-[46px] w-full rounded-lg border border-[#155DFC] bg-[#EFF6FF] font-[Geist_Mono] text-[14px] font-medium text-gray-800',
                        'flex items-center justify-center gap-1',
                        'hover:bg-blue-100 transition-colors',
                        'disabled:opacity-70 disabled:cursor-not-allowed'
                    )}
                >
                    {mutation.isPending ? (
                        <Spinner size="sm" className="text-gray-800" />
                    ) : (
                        <>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Login link */}
            <p className="mt-5 text-center font-[Geist_Mono] text-[13px] font-medium text-muted-foreground xl:mt-6 xl:text-[14px]">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-blue-600 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
