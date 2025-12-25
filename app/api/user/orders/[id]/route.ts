import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';
import { requireUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connect();
    try {
        const payload: any = requireUserFromRequest(req);
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: 'invalid id' }, { status: 400 });
        const order = await Order.findById(id);
        if (!order) return NextResponse.json({ message: 'not found' }, { status: 404 });
        if (order.userId.toString() !== payload.id) return NextResponse.json({ message: 'forbidden' }, { status: 403 });
        return NextResponse.json({ order });
    } catch (err: any) {
        return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
    }
}
