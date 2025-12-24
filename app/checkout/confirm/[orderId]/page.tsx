'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmPayment({ orderId, total }: { orderId: string; total: number }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function payWithPaystack() {
        setLoading(true);
        const res = await fetch('/api/payments/paystack/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (!res.ok) { alert(data.message || 'error'); setLoading(false); return; }
        // redirect to paystack checkout page
        window.location.href = data.authorization_url;
    }

    async function payWithFlutterwave() {
        setLoading(true);
        const res = await fetch('/api/payments/flutterwave/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (!res.ok) { alert(data.message || 'error'); setLoading(false); return; }
        window.location.href = data.payment_link;
    }

    return (
        <div>
            <div>Total: ₦{total}</div>
            <div className="flex gap-3 mt-4">
                <button onClick={payWithPaystack} disabled={loading} className="px-4 py-2 bg-yellow-500 rounded">Paystack</button>
                <button onClick={payWithFlutterwave} disabled={loading} className="px-4 py-2 bg-blue-600 rounded text-white">Flutterwave</button>
            </div>
        </div>
    );
}
