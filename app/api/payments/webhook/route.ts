// app/api/payments/paystack/webhook/route.ts
import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';
import Notification from '@/models/Notification';

export async function POST(req: Request) {
    await connect();
    const signature = req.headers.get('x-paystack-signature') || '';
    const bodyText = await req.text();

    // verify signature
    const crypto = await import('crypto');
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
    if (hash !== signature) return new Response('invalid signature', { status: 400 });

    const payload = JSON.parse(bodyText);
    // event: "charge.success"
    if (payload.event === 'charge.success') {
        const ref = payload.data.reference;
        // find order by paymentRef (we saved it on init)
        const order = await Order.findOne({ paymentRef: ref });
        if (!order) return new Response('order not found', { status: 200 });

        // double-check with paystack verify endpoint
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || verifyData.data.status !== 'success') {
            return new Response('not verified', { status: 200 });
        }

        order.status = 'PAID';
        order.paymentStatus = verifyData.data.status;
        await order.save();

        // create admin notification
        await Notification.create({
            orderId: order._id,
            type: 'order_paid',
            title: `Order ${order._id} paid (Paystack)`,
            payload: { reference: ref, amount: verifyData.data.amount / 100 },
            read: false,
        });

        return new Response('ok', { status: 200 });
    }

    return new Response('event ignored', { status: 200 });
}
