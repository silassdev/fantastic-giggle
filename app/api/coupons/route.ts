import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Coupon from '@/models/Coupon';
import mongoose from 'mongoose';

type CartItem = { productId: string; qty: number; price: number };

export async function POST(req: Request) {
    await connect();
    const body = await req.json();
    const { code, items } = body as { code?: string; items: CartItem[] };

    if (!code) return NextResponse.json({ ok: false, message: 'code required' }, { status: 400 });
    if (!Array.isArray(items) || !items.length) return NextResponse.json({ ok: false, message: 'cart empty' }, { status: 400 });

    // exact, case-sensitive match
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return NextResponse.json({ ok: false, message: 'invalid coupon' }, { status: 404 });

    if (!coupon.active) return NextResponse.json({ ok: false, message: 'coupon inactive' }, { status: 400 });
    if (coupon.expiresAt && Date.now() > coupon.expiresAt) return NextResponse.json({ ok: false, message: 'coupon expired' }, { status: 400 });
    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) return NextResponse.json({ ok: false, message: 'coupon usage limit reached' }, { status: 400 });

    // Compute eligible subtotal
    const productIdSet = new Set((coupon.productIds || []).map((id: any) => id.toString()));
    let eligibleAmount = 0;
    let total = 0;
    const breakdown: { item: CartItem; eligible: boolean; discount: number }[] = [];

    for (const it of items) {
        const lineTotal = it.price * (it.qty || 1);
        total += lineTotal;
        const eligible = productIdSet.size === 0 || productIdSet.has(it.productId.toString());
        const discount = eligible ? Math.round((lineTotal * coupon.percent) / 100) : 0;
        if (eligible) eligibleAmount += lineTotal;
        breakdown.push({ item: it, eligible, discount });
    }

    const discountTotal = breakdown.reduce((s, b) => s + b.discount, 0);
    const newTotal = Math.max(0, total - discountTotal);

    return NextResponse.json({
        ok: true,
        coupon: {
            id: coupon._id,
            code: coupon.code,
            title: coupon.title,
            percent: coupon.percent,
            description: coupon.description,
        },
        totals: { total, discount: discountTotal, newTotal },
        breakdown,
    });
}
