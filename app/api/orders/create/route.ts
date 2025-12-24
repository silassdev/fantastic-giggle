import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    await connect();
    const body = await req.json();
    const { items, form, couponCode } = body;

    let user = await User.findOne({ email: form.email });
    if (!user) {
        user = await User.create({
            name: form.fullName || form.name || form.email.split('@')[0],
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

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);

    let couponPayload = null;
    let discountTotal = 0;

    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode });
        if (coupon && coupon.active && (!coupon.expiresAt || Date.now() <= coupon.expiresAt) && (!coupon.usageLimit || (coupon.usedCount || 0) < coupon.usageLimit)) {
            const productIdSet = new Set((coupon.productIds || []).map((id: any) => id.toString()));

            for (const it of items) {
                const lineTotal = it.price * it.qty;
                const eligible = productIdSet.size === 0 || productIdSet.has(it.productId.toString());
                if (eligible) discountTotal += Math.round((lineTotal * coupon.percent) / 100);
            }

            if (discountTotal > 0) {
                couponPayload = {
                    id: coupon._id,
                    code: coupon.code,
                    percent: coupon.percent,
                    discountAmount: discountTotal,
                };

                if (coupon.usageLimit) {
                    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
                }
            }
        }
    }

    const order = await Order.create({
        userId: user._id,
        items: items.map((i: any) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty
        })),
        shipping: user.shipping,
        total: subtotal - discountTotal,
        appliedCoupon: couponPayload,
        status: 'PENDING_PAYMENT'
    });

    return NextResponse.json({ orderId: order._id });
}
