import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import connect from '@/lib/mongoose';
import { requireAdminFromRequest } from '@/lib/auth';

import Order from '@/models/Order';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { sendTrackingEmail } from '@/lib/email';
import { sendTrackingSMS } from '@/lib/sms';

import { z } from 'zod';

/**
 * Validation schema
 */
const trackingSchema = z.object({
    status: z.string().min(2, 'Status is required'),
    message: z.string().min(1, 'Message is required'),
    location: z.string().optional(),
});

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    await connect();

    try {
        // 🔐 Admin auth
        const admin = requireAdminFromRequest(req);

        const orderId = params.id;
        if (!mongoose.isValidObjectId(orderId)) {
            return NextResponse.json({ message: 'Invalid order id' }, { status: 400 });
        }

        const body = await req.json();
        const parsed = trackingSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // fetch user
        const user = await User.findById(order.userId);

        // send notifications (non-blocking)
        if (user?.email) {
            sendTrackingEmail({
                to: user.email,
                orderId: order._id.toString(),
                status: parsed.data.status,
                message: parsed.data.message,
                location: parsed.data.location,
            }).catch(console.error);
        }

        if (user?.shipping?.phone) {
            sendTrackingSMS({
                phone: user.shipping.phone,
                message: `Order ${order._id}: ${parsed.data.status} – ${parsed.data.message}`,
            }).catch(console.error);
        }

        // 🧾 Tracking update
        const trackingUpdate = {
            status: parsed.data.status,
            message: parsed.data.message,
            location: parsed.data.location || '',
            updatedBy: admin.id,
            createdAt: new Date(),
        };

        if (!order.trackingUpdates) order.trackingUpdates = [];
        order.trackingUpdates.push(trackingUpdate as any);
        order.trackingStatus = parsed.data.status;

        // Optional: auto-sync main order status
        const lowerStatus = parsed.data.status.toLowerCase();
        if (lowerStatus.includes('deliver')) {
            order.status = 'DELIVERED';
        } else if (lowerStatus.includes('ship')) {
            order.status = 'SHIPPED';
        }

        await order.save();

        // 🔔 User notification
        await Notification.create({
            userId: order.userId,
            orderId: order._id,
            type: 'order_tracking',
            title: `Order update: ${parsed.data.status}`,
            payload: {
                orderId: order._id.toString(),
                status: parsed.data.status,
                message: parsed.data.message,
                location: parsed.data.location || '',
            },
            read: false,
        });

        return NextResponse.json({
            ok: true,
            tracking: trackingUpdate,
        });
    } catch (err: any) {
        console.error('ADMIN_TRACKING_ERROR', err);
        return NextResponse.json(
            { message: 'Unauthorized or server error' },
            { status: 401 }
        );
    }
}
