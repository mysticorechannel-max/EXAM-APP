import { z } from 'zod';
export const verifyEmailSchema = z.object({
    otp: z
        .string()
        .min(1, 'Verification code is required')
        .length(6, 'Code must be exactly 6 digits')
        .regex(/^\d{6}$/, 'Code must contain only numbers'),
});
