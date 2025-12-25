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


    let couponPayload = undefined;
    if (body.couponCode) {
        const code = body.couponCode; // from client checkout
        const coupon = await Coupon.findOne({ code });
        if (coupon && coupon.active && (!coupon.expiresAt || Date.now() <= coupon.expiresAt) && (!coupon.usageLimit || (coupon.usedCount || 0) < coupon.usageLimit)) {
            // compute discount same way as apply route
            const productIdSet = new Set((coupon.productIds || []).map((id: any) => id.toString()));
            let discountTotal = 0;
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

                // atomically increment usedCount (only if coupon has usageLimit)
                if (coupon.usageLimit) {
                    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
                }
            }
        }
    }

    const finalTotal = subtotal - (couponPayload?.discountAmount || 0);

    // create order, include appliedCoupon
    const newOrder = new Order({
        userId: user._id,
        items: items.map((i: any) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty
        })),
        shipping: {
            phone: user.shipping?.phone || '',
            address: user.shipping?.address || '',
            city: user.shipping?.city || '',
            state: user.shipping?.state || '',
            country: user.shipping?.country || 'Nigeria',
        },
        total: finalTotal,
        appliedCoupon: couponPayload,
        status: 'PENDING_PAYMENT'
    });

    await newOrder.save();

    return NextResponse.json({ orderId: newOrder._id });
}
