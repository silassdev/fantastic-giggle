'use client';
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    async function loadOrder() {
        const res = await fetch(`/api/user/orders/${id}`);
        if (res.ok) {
            const data = await res.json();
            setOrder(data.order);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadOrder();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading order details...</div>;
    if (!order) return <div className="p-10 text-center text-red-500">Order not found</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <Link href="/dashboard" className="text-sm text-brand-primary hover:underline mb-6 inline-block font-bold">
                ← Back to Dashboard
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl border border-white/20">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-dark dark:text-white">Order Details</h1>
                        <p className="text-gray-500 mt-1">ID: {order._id}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-brand-primary">₦{order.total}</div>
                        <div className={`mt-2 inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }`}>
                            {order.status}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-400">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.productId} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-900 last:border-0">
                                    <div>
                                        <div className="font-bold text-brand-dark dark:text-white">{item.name}</div>
                                        <div className="text-sm text-gray-500">Qty: {item.qty} × ₦{item.price}</div>
                                    </div>
                                    <div className="font-bold">₦{item.qty * item.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-400">Shipping Info</h3>
                            <div className="text-brand-dark dark:text-gray-300 space-y-1">
                                <p className="font-bold">{order.shipping?.phone}</p>
                                <p>{order.shipping?.address}</p>
                                <p>{order.shipping?.city}, {order.shipping?.state}</p>
                                <p>{order.shipping?.country}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-400">Tracking</h3>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="font-bold text-brand-primary mb-1 uppercase text-sm tracking-widest">
                                    Current Status: {order.trackingStatus || 'Processing'}
                                </div>
                                {order.trackingUpdates?.length > 0 ? (
                                    <div className="mt-4 space-y-4">
                                        {order.trackingUpdates.map((update: any, idx: number) => (
                                            <div key={idx} className="relative pl-6 border-l-2 border-brand-primary/20 pb-4 last:pb-0">
                                                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-brand-primary"></div>
                                                <div className="font-bold text-sm">{update.status}</div>
                                                <div className="text-xs text-gray-500">{update.message}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">{new Date(update.createdAt).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic mt-2">No tracking updates yet. Check back soon.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
