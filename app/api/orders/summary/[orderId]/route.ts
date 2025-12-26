import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
    await connect();
    try {
        const { orderId } = await params;

        if (!mongoose.isValidObjectId(orderId)) {
            return NextResponse.json({ message: 'Invalid Order ID' }, { status: 400 });
        }

        const order = await Order.findById(orderId).lean();

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Return a sanitized summary
        return NextResponse.json({
            id: order._id,
            total: order.total,
            items: order.items,
            shipping: order.shipping,
            status: order.status
        });
    } catch (err) {
        console.error('Order summary error:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
