'use client';
import React from 'react';

export default function CouponList({ coupons, onRevoke, onEdit }: { coupons: any[], onRevoke: (id: string) => void, onEdit: (c: any) => void }) {
    return (
        <div className="space-y-2">
            {coupons.map(c => (
                <div key={c._id} className="p-3 bg-white rounded flex justify-between items-center">
                    <div>
                        <div className="font-semibold">{c.code} — {c.title}</div>
                        <div className="text-sm text-gray-600">{c.description}</div>
                        <div className="text-sm text-gray-500">Discount: {c.percent}% {c.productIds?.length ? `| Products: ${c.productIds.length}` : '| Global'}</div>
                        <div className="text-xs text-gray-400">Active: {String(c.active)}</div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(c)} className="px-2 py-1 border rounded">Edit</button>
                        <button onClick={() => onRevoke(c._id)} className="px-2 py-1 border rounded text-red-600">Revoke</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
