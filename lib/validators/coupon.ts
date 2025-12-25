import { z } from 'zod';
import mongoose from 'mongoose';

export const createCouponSchema = z.object({
    code: z.string().min(1),
    title: z.string().optional(),
    description: z.string().optional(),
    percent: z.number().int().min(1).max(100),
    productIds: z.array(z.string().refine((s) => mongoose.Types.ObjectId.isValid(s), { message: 'invalid objectId' })).optional().default([]),
    usageLimit: z.number().int().positive().optional(),
    minCartTotal: z.number().nonnegative().optional().default(0),
    expiresAt: z.number().optional(),
});

export const updateCouponSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    percent: z.number().int().min(1).max(100).optional(),
    productIds: z.array(z.string().refine((s) => mongoose.Types.ObjectId.isValid(s), { message: 'invalid objectId' })).optional(),
    usageLimit: z.number().int().positive().optional().nullable(),
    minCartTotal: z.number().nonnegative().optional(),
    expiresAt: z.number().optional().nullable(),
    active: z.boolean().optional(),
});

export const applyCouponSchema = z.object({
    code: z.string().min(1),
    items: z.array(z.object({
        productId: z.string().refine((s) => mongoose.Types.ObjectId.isValid(s), { message: 'invalid objectId' }),
        qty: z.number().int().min(1),
        price: z.number().nonnegative(),
    })).min(1),
});
