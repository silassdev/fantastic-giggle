import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    type: String, // e.g. 'order_paid'
    title: String,
    payload: Schema.Types.Mixed,
    read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
