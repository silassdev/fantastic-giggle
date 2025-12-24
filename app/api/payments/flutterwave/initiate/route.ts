import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';

export async function POST(req: Request) {
    await connect();
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ message: 'orderId required' }, { status: 400 });

    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ message: 'order not found' }, { status: 404 });

    const body = {
        tx_ref: `order_${order._id.toString()}_${Date.now()}`,
        amount: String(order.total),
        currency: 'NGN',
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/flutterwave/callback`,
        payment_options: 'card,ussd,banktransfer',
        customer: {
            email: (order as any).shipping?.email || 'customer@example.com',
            phonenumber: (order as any).shipping?.phone || '',
            name: (order as any).shipping?.name || 'Customer',
        },
        meta: { orderId: order._id.toString() },
    };

    const res = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ message: 'flutterwave init failed', detail: data }, { status: 502 });

    order.paymentMethod = 'flutterwave';
    order.paymentRef = body.tx_ref;
    await order.save();

    return NextResponse.json({ payment_link: data.data.link, tx_ref: body.tx_ref });
}
