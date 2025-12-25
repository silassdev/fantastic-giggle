'use client';
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    async function loadOrder() {
        // We reuse user order details API or create a specific admin one if needed
        // For now assuming we can fetch by ID if authenticated as admin
        const res = await fetch(`/api/user/orders/${id}`);
        if (res.ok) {
            const data = await res.json();
            setOrder(data.order);
        }
        setLoading(false);
    }

    async function updateTracking(e: React.FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const status = (form.elements.namedItem('status') as HTMLInputElement).value;
        const message = (form.elements.namedItem('message') as HTMLInputElement).value;
        const location = (form.elements.namedItem('location') as HTMLInputElement).value;

        setUpdating(true);
        const res = await fetch(`/api/admin/orders/${id}/tracking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, message, location })
        });
        setUpdating(false);

        if (res.ok) {
            loadOrder();
            form.reset();
            alert('Tracking updated successfully');
        } else {
            alert('Failed to update tracking');
        }
    }

    useEffect(() => { loadOrder(); }, [id]);

    if (loading) return <div className="p-10 text-center font-bold">Loading order details...</div>;
    if (!order) return <div className="p-10 text-center text-red-500 font-bold">Order not found</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <Link href="/admin/orders" className="text-sm text-brand-primary hover:underline mb-6 inline-block font-bold uppercase tracking-widest">
                ← Back to Orders
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8 rounded-3xl border border-white/20">
                        <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                            <div>
                                <h1 className="text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tighter">Order #{order._id.slice(-8).toUpperCase()}</h1>
                                <p className="text-xs text-gray-500 font-mono mt-1">{order._id}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-brand-primary">₦{order.total.toLocaleString()}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">{order.paymentMethod || 'NO PAYMENT METHOD'}</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 border-l-4 border-brand-primary pl-3">Order Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.productId} className="flex justify-between items-center p-4 bg-brand-dark/5 dark:bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <div className="font-bold text-brand-dark dark:text-white">{item.name}</div>
                                            <div className="text-xs text-gray-500 font-medium">Quantity: {item.qty} × ₦{item.price.toLocaleString()}</div>
                                        </div>
                                        <div className="font-black text-brand-dark dark:text-white">₦{(item.qty * item.price).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-3xl border border-white/20">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 border-l-4 border-brand-primary pl-3 mb-6">Customer & Shipping</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</div>
                                    <div className="font-bold text-brand-dark dark:text-white">{order.userId?.name || 'Guest'}</div>
                                    <div className="text-xs text-gray-500 font-medium">{order.userId?.email || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</div>
                                    <div className="font-bold text-brand-dark dark:text-white">{order.shipping?.phone || 'N/A'}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Address</div>
                                <div className="text-xs text-brand-dark dark:text-gray-300 leading-relaxed font-medium">
                                    {order.shipping?.address}<br />
                                    {order.shipping?.city}, {order.shipping?.state}<br />
                                    {order.shipping?.country}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8 rounded-3xl border border-white/20">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 border-l-4 border-brand-primary pl-3 mb-6">Update Tracking</h3>
                        <form onSubmit={updateTracking} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Current Status</label>
                                <select name="status" defaultValue={order.trackingStatus || 'Processing'} className="w-full px-4 py-3 rounded-xl bg-brand-dark/5 dark:bg-white/5 border border-white/10 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none transition-standard">
                                    <option>Processing</option>
                                    <option>Packed</option>
                                    <option>Shipped</option>
                                    <option>Out for Delivery</option>
                                    <option>Delivered</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Location (Optional)</label>
                                <input name="location" placeholder="e.g. Lagos Warehouse" className="w-full px-4 py-3 rounded-xl bg-brand-dark/5 dark:bg-white/5 border border-white/10 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none transition-standard" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Internal Note</label>
                                <textarea name="message" required placeholder="Details about this update..." className="w-full px-4 py-3 rounded-xl bg-brand-dark/5 dark:bg-white/5 border border-white/10 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none h-24 transition-standard" />
                            </div>
                            <button disabled={updating} type="submit" className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-secondary transition-standard shadow-lg shadow-brand-primary/20 disabled:opacity-50">
                                {updating ? 'Updating...' : 'Post Update'}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-3xl border border-white/20">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 border-l-4 border-brand-primary pl-3 mb-6">History Log</h3>
                        <div className="space-y-6">
                            {!order.trackingUpdates?.length ? (
                                <p className="text-xs text-gray-500 italic text-center py-4">No tracking history yet.</p>
                            ) : order.trackingUpdates.map((log: any, idx: number) => (
                                <div key={idx} className="relative pl-6 border-l-2 border-brand-primary/20 pb-4 last:pb-0">
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-brand-primary border-4 border-white dark:border-gray-900 shadow-sm"></div>
                                    <div className="font-black text-[10px] text-brand-primary uppercase tracking-widest">{log.status}</div>
                                    <div className="text-xs text-brand-dark dark:text-gray-300 font-bold mt-1 leading-tight">{log.message}</div>
                                    <div className="text-[9px] text-gray-400 mt-1 uppercase font-black">{new Date(log.createdAt).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
