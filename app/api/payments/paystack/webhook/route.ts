import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';
import Notification from '@/models/Notification';
import { reserveWebhookEvent, markWebhookProcessed } from '@/lib/webhookIdempotency';
import crypto from 'crypto';

export async function POST(req: Request) {
    await connect();

    const bodyText = await req.text();
    const signature = req.headers.get('x-paystack-signature') || '';
    const secret = process.env.PAYSTACK_SECRET_KEY || '';

    // verify signature (throws away mismatch)
    const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
    if (hash !== signature) {
        return new Response('invalid signature', { status: 400 });
    }

    const payload = JSON.parse(bodyText);
    const eventId = String(payload.data?.id || payload.data?.reference || Date.now());

    const { created, doc } = await reserveWebhookEvent('paystack', eventId, payload);
    if (!created) {
        if (doc?.processed) return new Response('already processed', { status: 200 });
        return new Response('reserved by another worker', { status: 200 });
    }

    try {
        if (payload.event === 'charge.success' || payload.event === 'charge.success') {
            const ref = payload.data.reference;
            // verify with paystack verify endpoint
            const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || verifyData.data?.status !== 'success') {
                // mark processed false? We'll leave as processed==false to allow retries
                return new Response('verification failed', { status: 200 });
            }

            const order = await Order.findOne({ paymentRef: ref });
            if (!order) {
                // still mark processed so provider won't keep retrying duplicates
                await markWebhookProcessed('paystack', eventId);
                return new Response('order not found', { status: 200 });
            }

            if (order.status !== 'PAID') {
                order.status = 'PAID';
                order.paymentStatus = verifyData.data.status;
                await order.save();

                await Notification.create({
                    orderId: order._id,
                    type: 'order_paid',
                    title: `Order ${order._id} paid (Paystack)`,
                    payload: { reference: ref, amount: verifyData.data.amount / 100 },
                    read: false,
                });
            }

            await markWebhookProcessed('paystack', eventId);
            return new Response('ok', { status: 200 });
        }

        // other events: ignore but mark processed
        await markWebhookProcessed('paystack', eventId);
        return new Response('ignored', { status: 200 });
    } catch (err) {
        console.error('paystack webhook error', err);
        // do not mark processed on unexpected errors to allow retry
        return new Response('internal error', { status: 500 });
    }
}
