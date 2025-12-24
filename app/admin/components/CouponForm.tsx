'use client';
import React, { useState } from 'react';

export default function CouponForm({ onSaved, initial }: { onSaved: () => void, initial?: any }) {
    const [code, setCode] = useState(initial?.code || '');
    const [title, setTitle] = useState(initial?.title || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [percent, setPercent] = useState(initial?.percent || 10);
    const [productIdsText, setProductIdsText] = useState((initial?.productIds || []).join(',') || ''); // comma separated ids
    const [usageLimit, setUsageLimit] = useState(initial?.usageLimit || '');

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        const body: any = { code, title, description, percent, productIds: productIdsText ? productIdsText.split(',').map(s => s.trim()) : [] };
        if (usageLimit) body.usageLimit = Number(usageLimit);
        const res = await fetch('/api/admin/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (res.ok) { onSaved(); setCode(''); setTitle(''); setDescription(''); setPercent(10); setProductIdsText(''); setUsageLimit(''); }
        else { const d = await res.json(); alert(d.message || 'error'); }
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <input placeholder="Coupon code (case-sensitive)" value={code} onChange={e => setCode(e.target.value)} className="w-full border px-3 py-2 rounded" />
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" />
            <div className="flex gap-2">
                <input type="number" min={1} max={100} value={percent} onChange={e => setPercent(Number(e.target.value))} className="w-1/2 border px-3 py-2 rounded" />
                <input placeholder="Usage limit (optional)" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} className="w-1/2 border px-3 py-2 rounded" />
            </div>
            <input placeholder="Product IDs (comma separated) — leave empty for all products" value={productIdsText} onChange={e => setProductIdsText(e.target.value)} className="w-full border px-3 py-2 rounded" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Coupon</button>
        </form>
    );
}
