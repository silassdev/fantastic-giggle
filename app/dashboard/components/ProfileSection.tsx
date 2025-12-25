'use client';
import React, { useEffect, useState } from 'react';

export default function ProfileSection() {
    const [profile, setProfile] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<any>({});

    useEffect(() => { load(); }, []);
    async function load() {
        const res = await fetch('/api/user/profile');
        if (!res.ok) return;
        const d = await res.json();
        setProfile(d.user);
        setForm(d.user || {});
    }
    async function save(e: any) {
        e?.preventDefault();
        const res = await fetch('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        if (res.ok) { setEditing(false); load(); }
        else { const d = await res.json(); alert(d.message || 'error'); }
    }
    return (
        <div>
            <h3 className="font-semibold mb-3">My Profile</h3>
            {!profile ? <div>Loading...</div> : (
                <div>
                    {!editing ? (
                        <div>
                            <div className="text-sm"><strong>Name:</strong> {profile.name || '-'}</div>
                            <div className="text-sm"><strong>Email:</strong> {profile.email}</div>
                            <div className="text-sm"><strong>Phone:</strong> {profile.shipping?.phone || profile.phone || '-'}</div>
                            <button className="mt-3 px-3 py-1 border rounded" onClick={() => setEditing(true)}>Edit</button>
                        </div>
                    ) : (
                        <form onSubmit={save} className="space-y-2">
                            <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border px-3 py-2 rounded" placeholder="Name" />
                            <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border px-3 py-2 rounded" placeholder="Phone" />
                            <input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border px-3 py-2 rounded" placeholder="Address" />
                            <div className="flex gap-2">
                                <input value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} className="w-1/2 border px-3 py-2 rounded" placeholder="City" />
                                <input value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value })} className="w-1/2 border px-3 py-2 rounded" placeholder="State" />
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                                <button type="button" className="px-4 py-2 border rounded" onClick={() => setEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
