import { z } from 'zod';
export const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters'),
});
