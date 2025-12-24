import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Order from '@/models/Order';
import Notification from '@/models/Notification';

export async function POST(req: Request) {
    await connect();
    const payload = await req.json();

    // Flutterwave sends event and data. Safest approach: verify by calling RAVE verify endpoint
    // Retrieve id or tx_ref from payload
    const tx_ref = payload?.data?.tx_ref || payload?.tx_ref || null;
    const flwTransactionId = payload?.data?.id || payload?.id || null;

    if (!tx_ref && !flwTransactionId) return NextResponse.json({ message: 'ignored' }, { status: 200 });

    // Verify with Flutterwave
    // preferred: GET /v3/transactions/{id}/verify OR /v3/transactions/verify_by_reference?tx_ref=...
    // Use tx_ref verification:
    const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${flwTransactionId}/verify`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
    });

    // Fallback: if above fails but tx_ref exists, try verify by tx_ref (this endpoint may vary)
    let verifyData;
    if (verifyRes.ok) verifyData = await verifyRes.json();
    else if (tx_ref) {
        const alt = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(tx_ref)}`, {
            headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
        });
        verifyData = await alt.json();
    } else {
        return NextResponse.json({ message: 'could not verify' }, { status: 200 });
    }

    // check verifyData structure and status
    const status = verifyData?.data?.status || verifyData?.status;
    const ref = verifyData?.data?.tx_ref || tx_ref;

    if (status === 'successful' || status === 'paid') {
        // find the order by tx_ref (we saved it at init)
        const order = await Order.findOne({ paymentRef: ref });
        if (!order) return NextResponse.json({ message: 'order not found' }, { status: 200 });

        order.status = 'PAID';
        order.paymentStatus = status;
        await order.save();

        await Notification.create({
            orderId: order._id,
            type: 'order_paid',
            title: `Order ${order._id} paid (Flutterwave)`,
            payload: { tx_ref: ref, flw: verifyData?.data },
            read: false,
        });

        return NextResponse.json({ message: 'ok' }, { status: 200 });
    }

    return NextResponse.json({ message: 'not successful' }, { status: 200 });
}
