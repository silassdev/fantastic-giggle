'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadOrders() {
        const res = await fetch('/api/admin/orders');
        if (res.ok) {
            const data = await res.json();
            setOrders(data.items || []);
        }
        setLoading(false);
    }

    useEffect(() => { loadOrders(); }, []);

    if (loading) return <div className="p-10 text-center text-brand-dark dark:text-white font-bold">Loading orders...</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 text-brand-dark dark:text-white text-center md:text-left">Manage Orders</h1>

            <div className="glass overflow-hidden rounded-3xl border border-white/20 shadow-xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-brand-dark/5 dark:bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-widest font-black">
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No orders found in the system.</td>
                            </tr>
                        ) : orders.map((o) => (
                            <motion.tr
                                key={o._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-brand-primary/5 transition-standard"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-mono text-[10px] text-gray-500">#{o._id.slice(-8).toUpperCase()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-brand-dark dark:text-white capitalize">{o.userId?.name || 'Guest'}</div>
                                    <div className="text-xs text-gray-500">{o.userId?.email || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 font-black text-brand-primary">₦{o.total.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${o.status === 'PAID' ? 'bg-green-500/10 text-green-500' :
                                            o.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500' :
                                                o.status === 'DELIVERED' ? 'bg-indigo-500/10 text-indigo-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(o.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/orders/${o._id}`}
                                        className="px-4 py-2 bg-brand-dark dark:bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-brand-primary transition-standard shadow-lg"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
