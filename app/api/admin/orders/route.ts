import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';
import { requireAdminFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
    await connect();
    try { requireAdminFromRequest(req); } catch { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }

    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const items = await Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email');
    const total = await Order.countDocuments();

    return NextResponse.json({ items, total });
}
