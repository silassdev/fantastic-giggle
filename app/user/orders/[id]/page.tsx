// app/dashboard/orders/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type TrackingUpdate = {
    status: string;
    message: string;
    location?: string;
    createdAt: string;
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrder();
    }, []);

    async function loadOrder() {
        try {
            const res = await fetch(`/api/user/orders/${orderId}`);
            if (!res.ok) {
                router.push('/dashboard');
                return;
            }
            const data = await res.json();
            setOrder(data.order);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="p-6">Loading order...</div>;
    }

    if (!order) {
        return <div className="p-6">Order not found</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            <button
                onClick={() => router.back()}
                className="mb-4 text-sm text-blue-600"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-semibold mb-4">
                Order #{order._id}
            </h1>

            {/* Order summary */}
            <div className="bg-white rounded shadow p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Status:</strong> {order.status}</div>
                    <div><strong>Tracking:</strong> {order.trackingStatus || '—'}</div>
                    <div><strong>Total:</strong> ₦{order.total}</div>
                    <div><strong>Payment:</strong> {order.paymentMethod}</div>
                </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded shadow p-4 mb-6">
                <h2 className="font-semibold mb-3">Items</h2>
                <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            className="flex justify-between text-sm border-b pb-2"
                        >
                            <div>
                                {item.name} × {item.qty}
                            </div>
                            <div>₦{item.price * item.qty}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded shadow p-4 mb-6">
                <h2 className="font-semibold mb-3">Shipping</h2>
                <div className="text-sm space-y-1">
                    <div>{order.shipping?.address}</div>
                    <div>
                        {order.shipping?.city}, {order.shipping?.state}
                    </div>
                    <div>{order.shipping?.country}</div>
                    <div>Phone: {order.shipping?.phone}</div>
                </div>
            </div>

            {/* Tracking timeline */}
            <div className="bg-white rounded shadow p-4">
                <h2 className="font-semibold mb-4">Tracking updates</h2>

                {order.trackingUpdates?.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        No tracking updates yet.
                    </div>
                ) : (
                    <ol className="relative border-l border-gray-200">
                        {order.trackingUpdates
                            .slice()
                            .reverse()
                            .map((t: TrackingUpdate, idx: number) => (
                                <li key={idx} className="mb-6 ml-4">
                                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-1.5 mt-1" />
                                    <div className="text-sm font-semibold">
                                        {t.status}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {t.message}
                                    </div>
                                    {t.location && (
                                        <div className="text-xs text-gray-500">
                                            Location: {t.location}
                                        </div>
                                    )}
                                    <time className="text-xs text-gray-400">
                                        {new Date(t.createdAt).toLocaleString()}
                                    </time>
                                </li>
                            ))}
                    </ol>
                )}
            </div>
        </div>
    );
}
