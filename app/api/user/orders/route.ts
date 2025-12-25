import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';
import { requireUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
    await connect();
    try {
        const payload: any = requireUserFromRequest(req);
        const page = Number(new URL(req.url).searchParams.get('page') || '1');
        const limit = 50;
        const skip = (page - 1) * limit;
        const items = await Order.find({ userId: payload.id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        return NextResponse.json({ items });
    } catch (err: any) {
        return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
    }
}
