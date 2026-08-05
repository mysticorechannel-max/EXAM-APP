import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import { Spinner, PhoneInput } from '@/shared/components';
import { isApiError } from '@/shared/api';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { profileSchema, type ProfileFormData } from '../schemas/profile.schema';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { ChangeEmailDialog } from './ChangeEmailDialog';

export function ProfileForm() {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const { data: profile, isLoading } = useProfile();
    const updateProfileMutation = useUpdateProfile();

    // Fallback: read user fields from localStorage (saved during login)
    function getStoredUserField(field: string): string {
        try {
            const stored = localStorage.getItem('user');
            if (stored) {
                const user = JSON.parse(stored);
                return user[field] ?? '';
            }
        } catch {
            // ignore parse errors
        }
        return '';
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone || '',
            });
        }
    }, [profile, reset]);

    const onSubmit = (data: ProfileFormData) => {
        updateProfileMutation.reset();
        const payload: { firstName: string; lastName: string; phone?: string } = {
            firstName: data.firstName,
            lastName: data.lastName,
        };
        if (data.phone && data.phone.length > 5) {
            // Backend expects local format (e.g. 01280041976), not E.164 (+201280041976)
            let phone = data.phone.replace(/\s+/g, '');
            if (phone.startsWith('+20')) {
                phone = '0' + phone.slice(3);
            } else if (phone.startsWith('20') && phone.length > 10) {
                phone = '0' + phone.slice(2);
            }
            payload.phone = phone;
        }
        updateProfileMutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Profile updated successfully.');
            },
        });
    };

    const apiErrorMessage = updateProfileMutation.error
        ? isApiError(updateProfileMutation.error)
            ? updateProfileMutation.error.message
            : 'Something went wrong'
        : null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-5">
                {/* First name & Last name */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="firstName"
                            className="font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]"
                        >
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            {...register('firstName')}
                            className={cn(
                                'h-[40px] w-full rounded-lg border p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]',
                                'placeholder:text-muted-foreground',
                                'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
                                'disabled:cursor-not-allowed disabled:opacity-50',
                                errors.firstName ? 'border-destructive' : 'border-input'
                            )}
                            disabled={updateProfileMutation.isPending}
                        />
                        {errors.firstName && (
                            <p className="font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="lastName"
                            className="font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]"
                        >
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            {...register('lastName')}
                            className={cn(
                                'h-[40px] w-full rounded-lg border p-[10px] font-[Geist_Mono] text-[13px] bg-background xl:h-[46px] xl:text-[14px]',
                                'placeholder:text-muted-foreground',
                                'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
                                'disabled:cursor-not-allowed disabled:opacity-50',
                                errors.lastName ? 'border-destructive' : 'border-input'
                            )}
                            disabled={updateProfileMutation.isPending}
                        />
                        {errors.lastName && (
                            <p className="font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Username (read-only) */}
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
                        value={profile?.username || getStoredUserField('username')}
                        readOnly
                        tabIndex={-1}
                        className="h-[40px] w-full rounded-lg border border-gray-200 bg-gray-100 p-[10px] font-[Geist_Mono] text-[13px] text-gray-600 cursor-default select-none xl:h-[46px] xl:text-[14px]"
                    />
                </div>

                {/* Email (read-only) */}
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
                        value={profile?.email || getStoredUserField('email')}
                        readOnly
                        tabIndex={-1}
                        onClick={() => setEmailDialogOpen(true)}
                        className="h-[40px] w-full rounded-lg border border-gray-200 bg-gray-100 p-[10px] font-[Geist_Mono] text-[13px] text-gray-600 cursor-pointer select-none xl:h-[46px] xl:text-[14px] hover:border-[#155DFC]"
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="phone"
                        className="font-[Geist_Mono] text-[13px] font-medium text-foreground xl:text-[14px]"
                    >
                        Phone
                    </label>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <PhoneInput
                                value={field.value}
                                onChange={field.onChange}
                                disabled={updateProfileMutation.isPending}
                                hasError={!!errors.phone}
                            />
                        )}
                    />
                    {errors.phone && (
                        <p className="font-[Geist_Mono] text-[11px] text-destructive xl:text-[12px]">
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                {/* API error banner */}
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

                {/* Buttons row - Delete left, Save right */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setDeleteDialogOpen(true)}
                        className={cn(
                            'h-[40px] flex-1 rounded-lg border border-[#DC2626] font-[Geist_Mono] text-[13px] font-medium text-[#DC2626] xl:h-[46px] xl:text-[14px]',
                            'hover:bg-red-50 transition-colors'
                        )}
                    >
                        Delete My Account
                    </button>
                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className={cn(
                            'h-[46px] flex-1 rounded-lg bg-[#155DFC] font-[Geist_Mono] text-[14px] font-medium text-white',
                            'flex items-center justify-center',
                            'hover:bg-[#1250D4] transition-colors',
                            'disabled:opacity-70 disabled:cursor-not-allowed'
                        )}
                    >
                        {updateProfileMutation.isPending ? (
                            <Spinner size="sm" className="text-white" />
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>

            <DeleteAccountDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            />

            <ChangeEmailDialog
                open={emailDialogOpen}
                onClose={() => setEmailDialogOpen(false)}
            />
        </>
    );
}
