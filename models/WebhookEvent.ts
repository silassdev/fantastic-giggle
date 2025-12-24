import mongoose, { Schema } from 'mongoose';

const WebhookEventSchema = new Schema({
    provider: { type: String, required: true },
    eventId: { type: String, required: true },
    raw: Schema.Types.Mixed,
    processed: { type: Boolean, default: false },
    processedAt: Date,
}, { timestamps: true });

WebhookEventSchema.index({ provider: 1, eventId: 1 }, { unique: true });

export default mongoose.models.WebhookEvent || mongoose.model('WebhookEvent', WebhookEventSchema);
