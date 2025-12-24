import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { requireAdminFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    await connect();
    try { requireAdminFromRequest(request); } catch { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    const items = await Notification.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    return NextResponse.json({ items });
}
