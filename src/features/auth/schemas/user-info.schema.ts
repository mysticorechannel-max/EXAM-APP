import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const userInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    username: z
        .string()
        .min(1, 'Username is required')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .refine(isValidPhoneNumber, 'Please enter a valid phone number'),
});

export type UserInfoFormData = z.infer<typeof userInfoSchema>;
