import { z } from 'zod';

export const createTrackingSchema = z.object({
    status: z.string().min(2),
    message: z.string().min(1),
    location: z.string().optional(),
});
