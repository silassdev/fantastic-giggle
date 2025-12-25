'use client';
import React, { useState, useEffect } from 'react';
import CouponList from '../components/CouponList';
import CouponForm from '../components/CouponForm';

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);

    async function loadCoupons() {
        const res = await fetch('/api/admin/coupons');
        if (res.ok) {
            const data = await res.json();
            setCoupons(data.items || []);
        }
    }

    async function revokeCoupon(id: string) {
        if (!confirm('Delete this coupon?')) return;
        const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
        if (res.ok) loadCoupons();
    }

    useEffect(() => {
        loadCoupons();
    }, []);

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-brand-dark dark:text-white">Manage Coupons</h1>
                <button
                    onClick={() => { setEditingCoupon(null); setShowForm(!showForm); }}
                    className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-secondary transition-all"
                >
                    {showForm ? 'View List' : 'Create Coupon'}
                </button>
            </div>

            {showForm ? (
                <div className="glass p-8 rounded-3xl border border-white/20 mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-brand-dark dark:text-white">
                        {editingCoupon ? 'Edit Coupon' : 'New Coupon'}
                    </h2>
                    <CouponForm
                        initial={editingCoupon}
                        onSaved={() => { setShowForm(false); setEditingCoupon(null); loadCoupons(); }}
                    />
                </div>
            ) : (
                <div className="glass p-8 rounded-3xl border border-white/20">
                    <CouponList
                        coupons={coupons}
                        onRevoke={revokeCoupon}
                        onEdit={(c) => { setEditingCoupon(c); setShowForm(true); }}
                    />
                </div>
            )}
        </div>
    );
}
