import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    title?: string;
    description?: string;
    percent: number;
    productIds: mongoose.Types.ObjectId[];
    active: boolean;
    usageLimit?: number;
    usedCount?: number;
    minCartTotal?: number;
    expiresAt?: number;
    createdAt: Date;
    updatedAt: Date;
    revokedAt?: number | null;
}

const CouponSchema = new Schema<ICoupon>({
    code: { type: String, required: true, unique: true },
    title: { type: String },
    description: { type: String },
    percent: { type: Number, required: true, min: 0, max: 100 },
    productIds: { type: [Schema.Types.ObjectId], default: [] },
    active: { type: Boolean, default: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Number },
    revokedAt: { type: Number },
}, { timestamps: true });


export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
