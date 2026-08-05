import { z } from 'zod';

export const createAccountSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
