'use client';
import React from 'react';
import CouponForm from '../../components/CouponForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewCouponPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto px-6 py-8">
            <Link href="/admin/coupons" className="text-sm text-brand-primary hover:underline mb-6 inline-block font-bold uppercase tracking-widest">
                ← Back to Coupons
            </Link>

            <div className="max-w-2xl mx-auto">
                <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl">
                    <h1 className="text-3xl font-black text-brand-dark dark:text-white mb-2">Create Coupon</h1>
                    <p className="text-gray-500 mb-10">Generate a new discount code for your customers.</p>

                    <CouponForm
                        onSaved={() => router.push('/admin/coupons')}
                    />
                </div>
            </div>
        </div>
    );
}
