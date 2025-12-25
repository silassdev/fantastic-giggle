import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Coupon from '@/models/Coupon';
import { applyCouponSchema } from '@/lib/validators/coupon';
import { isRateLimited } from '@/lib/rateLimiter';
import mongoose from 'mongoose';

type CartItem = { productId: string; qty: number; price: number };

export async function POST(req: Request) {
    await connect();

    // rate-limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const rl = isRateLimited(`coupon_apply:${ip}`);
    if (rl.limited) {
        return NextResponse.json({ ok: false, message: `Too many attempts. Try again in ${Math.ceil(rl.resetAfterMs / 1000)}s` }, { status: 429 });
    }

    // parse + validate
    let body: any;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = applyCouponSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ ok: false, message: 'Invalid payload', errors: parsed.error.format() }, { status: 400 });
    }
    const { code, items } = parsed.data;

    const coupon = await Coupon.findOne({ code });
    if (!coupon) return NextResponse.json({ ok: false, message: 'invalid coupon' }, { status: 404 });

    if (!coupon.active) return NextResponse.json({ ok: false, message: 'coupon inactive' }, { status: 400 });
    if (coupon.expiresAt && Date.now() > coupon.expiresAt) return NextResponse.json({ ok: false, message: 'coupon expired' }, { status: 400 });
    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) return NextResponse.json({ ok: false, message: 'coupon usage limit reached' }, { status: 400 });

    // compute totals
    const productIdSet = new Set((coupon.productIds || []).map((id: any) => id.toString()));
    let total = 0;
    let discountTotal = 0;
    const breakdown: { productId: string; qty: number; price: number; eligible: boolean; discount: number }[] = [];

    for (const it of items) {
        const lineTotal = it.price * it.qty;
        total += lineTotal;
        const eligible = productIdSet.size === 0 || productIdSet.has(it.productId.toString());
        const discount = eligible ? Math.round((lineTotal * coupon.percent) / 100) : 0;
        discountTotal += discount;
        breakdown.push({ productId: it.productId, qty: it.qty, price: it.price, eligible, discount });
    }

    // enforce minCartTotal if set
    const minTotal = coupon.minCartTotal || 0;
    if (minTotal > 0 && total < minTotal) {
        return NextResponse.json({ ok: false, message: `Cart total must be at least ${minTotal} to use this coupon` }, { status: 400 });
    }

    const newTotal = Math.max(0, total - discountTotal);

    return NextResponse.json({
        ok: true,
        coupon: {
            id: coupon._id,
            code: coupon.code,
            title: coupon.title,
            percent: coupon.percent,
            description: coupon.description,
            minCartTotal: coupon.minCartTotal || 0,
        },
        totals: { total, discount: discountTotal, newTotal },
        breakdown,
        rateLimit: { remaining: rl.remaining, resetAfterMs: rl.resetAfterMs },
    });
}