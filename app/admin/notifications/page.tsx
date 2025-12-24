'use client';
import React, { useEffect, useState } from 'react';

export default function NotificationsPage() {
    const [notes, setNotes] = useState<any[]>([]);

    async function load() {
        const res = await fetch('/api/admin/notifications', { method: 'GET' });
        if (!res.ok) { /* handle auth */ return; }
        const d = await res.json();
        setNotes(d.items || []);
    }

    useEffect(() => { load() }, []);

    return (
        <div className="container mx-auto px-6 py-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
                {notes.map(n => (
                    <div key={n._id} className="p-3 bg-white rounded shadow flex justify-between">
                        <div>
                            <div className="font-semibold">{n.title}</div>
                            <div className="text-sm text-gray-600">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <a href={`/admin/notifications/${n._id}`} className="text-sm text-blue-600">View</a>
                    </div>
                ))}
            </div>
        </div>
    );
}
