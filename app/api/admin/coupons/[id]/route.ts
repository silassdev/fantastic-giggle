import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Coupon from '@/models/Coupon';
import { requireAdminFromRequest } from '@/lib/auth';
import { updateCouponSchema } from '@/lib/validators/coupon';


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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connect();
    try { requireAdminFromRequest(req); } catch { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }

    const { id } = params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: 'invalid id' }, { status: 400 });

    const bodyText = await req.text();
    let body: any;
    try { body = JSON.parse(bodyText); } catch { return NextResponse.json({ message: 'invalid json' }, { status: 400 }); }

    const parsed = updateCouponSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: 'invalid input', errors: parsed.error.format() }, { status: 400 });

    const allowed = parsed.data;
    const updated = await Coupon.findByIdAndUpdate(id, allowed, { new: true });
    return NextResponse.json(updated);
}

export async function POST(req: Request) {
    await connect();
    try { requireAdminFromRequest(req); } catch { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }

    const body = await req.json();
    const { code, title, description, percent, productIds = [], usageLimit, expiresAt } = body;

    if (!code || typeof percent !== 'number') return NextResponse.json({ message: 'invalid input' }, { status: 400 });
    if (percent <= 0 || percent > 100) return NextResponse.json({ message: 'percent must be 1-100' }, { status: 400 });

    try {
        const c = await Coupon.create({
            code,
            title,
            description,
            percent,
            productIds,
            usageLimit,
            expiresAt,
            active: true,
        });
        return NextResponse.json(c, { status: 201 });
    } catch (err: any) {
        if (err.code === 11000) return NextResponse.json({ message: 'code already exists' }, { status: 409 });
        return NextResponse.json({ message: 'error creating coupon' }, { status: 500 });
    }
}
