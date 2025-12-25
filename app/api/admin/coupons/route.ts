import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Coupon from '@/models/Coupon';
import { requireAdminFromRequest } from '@/lib/auth';
import { createCouponSchema } from '@/lib/validators/coupon';


export async function GET(req: Request) {
    await connect();
    try { requireAdminFromRequest(req); } catch { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }

    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (q) filter.$or = [{ code: q }, { title: { $regex: q, $options: 'i' } }];

    const items = await Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Coupon.countDocuments(filter);
    return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
    await connect();
    try { requireAdminFromRequest(req); } catch { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }

    const bodyText = await req.text();
    let body: any;
    try { body = JSON.parse(bodyText); } catch { return NextResponse.json({ message: 'invalid json' }, { status: 400 }); }

    const parsed = createCouponSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: 'invalid input', errors: parsed.error.format() }, { status: 400 });

    const val = parsed.data;
    try {
        const c = await Coupon.create({
            code: val.code,
            title: val.title,
            description: val.description,
            percent: val.percent,
            productIds: val.productIds,
            usageLimit: val.usageLimit,
            minCartTotal: val.minCartTotal,
            expiresAt: val.expiresAt,
            active: true,
        });
        return NextResponse.json(c, { status: 201 });
    } catch (err: any) {
        if (err.code === 11000) return NextResponse.json({ message: 'code already exists' }, { status: 409 });
        return NextResponse.json({ message: 'error creating coupon' }, { status: 500 });
    }
}
