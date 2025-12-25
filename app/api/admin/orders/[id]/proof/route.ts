import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';
import { requireAdminFromRequest } from '@/lib/auth';
import { uploadProof } from '@/lib/upload';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    await connect();
    requireAdminFromRequest(req);

    const body = await req.json();
    const { imageBase64, signature } = body;

    if (!imageBase64 || !signature) {
        return NextResponse.json({ message: 'Missing proof data' }, { status: 400 });
    }

    const imageUrl = await uploadProof(imageBase64);

    const order = await Order.findByIdAndUpdate(
        params.id,
        {
            deliveryProof: {
                imageUrl,
                signature,
                deliveredAt: new Date(),
            },
            status: 'DELIVERED',
            trackingStatus: 'Delivered',
        },
        { new: true }
    );

    return NextResponse.json({ ok: true, order });
}
