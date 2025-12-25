'use client';
import React, { useEffect, useState } from 'react';

export default function NotificationsSection() {
    const [notes, setNotes] = useState<any[]>([]);
    useEffect(() => { load(); }, []);
    async function load() {
        const res = await fetch('/api/user/notifications');
        if (!res.ok) return;
        const d = await res.json();
        setNotes(d.items || []);
    }
    return (
        <div>
            <h3 className="font-semibold mb-3">Notifications</h3>
            {notes.length === 0 ? <div>No notifications</div> : (
                <div className="space-y-2">
                    {notes.map(n => (
                        <div key={n._id} className="p-2 border rounded">
                            <div className="font-semibold">{n.title}</div>
                            <div className="text-sm text-gray-600">{n.payload?.message || JSON.stringify(n.payload)}</div>
                            <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
