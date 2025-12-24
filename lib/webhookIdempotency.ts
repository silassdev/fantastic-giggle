import WebhookEvent from '@/models/WebhookEvent';

// Attempt to create event doc; returns { created, doc }.
// If unique index causes duplicate key, load existing doc.
export async function reserveWebhookEvent(provider: string, eventId: string, raw: any) {
    try {
        const doc = await WebhookEvent.create({ provider, eventId, raw, processed: false });
        return { created: true, doc };
    } catch (err: any) {
        // duplicate key or exists
        if (err.code === 11000) {
            const doc = await WebhookEvent.findOne({ provider, eventId });
            return { created: false, doc };
        }
        throw err;
    }
}

// Mark event processed
export async function markWebhookProcessed(provider: string, eventId: string) {
    return WebhookEvent.findOneAndUpdate(
        { provider, eventId },
        { processed: true, processedAt: new Date() },
        { new: true }
    );
}
