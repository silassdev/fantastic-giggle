'use client';
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Loader from '@/app/components/Loader';


export default function AdminNotificationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [note, setNote] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        const res = await fetch(`/api/admin/notifications/${id}`);
        if (res.ok) {
            const data = await res.json();
            setNote(data);
        }
        setLoading(false);
    }

    useEffect(() => { load(); }, [id]);

    if (loading) return <Loader size={7} />;
    if (!note) return <div className="p-10 text-center text-red-500">Notification not found</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <Link href="/admin/notifications" className="text-sm text-brand-primary hover:underline mb-6 inline-block font-bold">
                ← Back to Notifications
            </Link>

            <div className="glass p-8 rounded-3xl border border-white/20">
                <h1 className="text-2xl font-bold mb-2 text-brand-dark dark:text-white">{note.title}</h1>
                <p className="text-gray-500 mb-6 text-sm">{new Date(note.createdAt).toLocaleString()}</p>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-8">
                    <pre className="whitespace-pre-wrap text-brand-dark dark:text-gray-300 font-sans">
                        {JSON.stringify(note.payload, null, 2)}
                    </pre>
                </div>

                {note.orderId && (
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold">Related Order</h3>
                        <div className="p-4 border border-white/10 rounded-xl glass flex justify-between items-center">
                            <div>
                                <div className="text-sm text-gray-500">Order ID</div>
                                <div className="font-bold">{note.orderId._id || note.orderId}</div>
                            </div>
                            <Link href={`/admin/orders/${note.orderId._id || note.orderId}`} className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold">
                                View Order
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
