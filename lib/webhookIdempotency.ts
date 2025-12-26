import WebhookEvent from '@/models/WebhookEvent';

export async function reserveWebhookEvent(provider: string, eventId: string, raw: any) {
    try {
        const doc = await WebhookEvent.create({ provider, eventId, raw, processed: false });
        return { created: true, doc };
    } catch (err: any) {
        if (err.code === 11000) {
            const doc = await WebhookEvent.findOne({ provider, eventId });
            return { created: false, doc };
        }
        throw err;
    }
}


export async function markWebhookProcessed(provider: string, eventId: string) {
    return WebhookEvent.findOneAndUpdate(
        { provider, eventId },
        { processed: true, processedAt: new Date() },
        { new: true }
    );
}
