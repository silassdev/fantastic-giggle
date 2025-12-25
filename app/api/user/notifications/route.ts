import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { requireUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
    await connect();
    try {
        const payload: any = requireUserFromRequest(req);
        const page = Number(new URL(req.url).searchParams.get('page') || '1');
        const limit = 50;
        const skip = (page - 1) * limit;
        // Notifications created for any order belonging to user — simplest: filter by order.userId
        // to keep this simple we assume notifications have orderId populated
        const items = await Notification.find({ userId: payload.id }).sort({ createdAt: -1 }).limit(limit).skip(skip);
        // alternatively: join and filter only notifications for orders owned by user (heavier)
        return NextResponse.json({ items });
    } catch (err: any) {
        return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
    }
}
