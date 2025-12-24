import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';

export async function POST(req: Request) {
    await connect();
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ message: 'orderId required' }, { status: 400 });

    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ message: 'order not found' }, { status: 404 });

    // initialize with Paystack
    const amountKobo = Math.round(order.total * 100);
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/paystack/callback`; // optional
    const body = {
        email: (order as any).shipping?.email || 'customer@example.com',
        amount: amountKobo,
        reference: `order_${order._id.toString()}_${Date.now()}`,
        callback_url: callbackUrl,
        metadata: { orderId: order._id.toString() },
    };

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
        return NextResponse.json({ message: 'paystack init failed', detail: data }, { status: 502 });
    }

    // save reference to order
    order.paymentMethod = 'paystack';
    order.paymentRef = data.data.reference;
    await order.save();

    return NextResponse.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
}
