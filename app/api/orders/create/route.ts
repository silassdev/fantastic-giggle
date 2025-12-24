import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import Order from '@/models/Order';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    await connect();
    const { items, form } = await req.json();

    let user = await User.findOne({ email: form.email });
    if (!user) {
        user = await User.create({
            name: form.fullName || form.name || form.email.split('@')[0], // Fallback if name not provided
            email: form.email,
            password: await bcrypt.hash(form.password, 12),
            shipping: {
                phone: form.phone,
                address: form.address,
                city: form.city,
                state: form.state,
                country: 'Nigeria',
            },
        });
    }

    const total = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);

    const order = await Order.create({
        userId: user._id,
        items: items.map((i: any) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty
        })),
        shipping: user.shipping,
        total,
    });

    return NextResponse.json({ orderId: order._id });
}
