import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { requireAdminFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connect();
    try { requireAdminFromRequest(req); } catch { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: 'invalid id' }, { status: 400 });
    const n = await Notification.findById(id).populate('orderId');
    if (!n) return NextResponse.json({ message: 'not found' }, { status: 404 });
    return NextResponse.json(n);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connect();
    try { requireAdminFromRequest(req); } catch { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }
    const { id } = await params;
    const body = await req.json();
    const updated = await Notification.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
}
