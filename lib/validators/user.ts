import { z } from 'zod';

export const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(6).optional(),
    address: z.string().min(3).optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
});
