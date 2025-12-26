'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/app/components/Loader';

export default function CheckoutPage() {
    const { state, dispatch } = useCart();
    const { items } = state;
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        state: ''
    });

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponData, setCouponData] = useState<any>(null);
    const [couponError, setCouponError] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);
    const discount = couponData?.totals?.discount || 0;
    const shipping = items.length > 0 ? 2500 : 0;
    const total = subtotal - discount + shipping;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me', { credentials: 'include' });
                const data = await res.json();
                if (data?.user) {
                    setUser(data.user);
                    setForm(prev => ({
                        ...prev,
                        fullName: data.user.name || '',
                        email: data.user.email || '',
                    }));
                }
            } catch (err) {
                console.error('Auth check failed', err);
            } finally {
                setLoadingAuth(false);
            }
        };
        fetchUser();
    }, []);

    const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setApplyingCoupon(true);
        setCouponError('');
        try {
            const res = await fetch('/api/coupons/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, items })
            });
            const data = await res.json();
            if (data.ok) {
                setCouponData(data);
                setCouponError('');
            } else {
                setCouponError(data.message || 'Invalid coupon');
                setCouponData(null);
            }
        } catch (err) {
            setCouponError('Error applying coupon');
        } finally {
            setApplyingCoupon(false);
        }
    };

    const submitOrder = async () => {
        if (items.length === 0) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    form,
                    couponCode: couponData?.coupon?.code
                }),
            });
            const data = await res.json();
            if (res.ok) {
                dispatch({ type: 'clear' });
                router.push(`/checkout/confirm/${data.orderId}`);
            } else {
                alert(data.message || 'Failed to create order');
            }
        } catch (err) {
            alert('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingAuth) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50/50 dark:bg-transparent">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-brand-dark dark:text-white mb-2">Checkout</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Complete your premium order</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Shipping & Account */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm">1</span>
                                Account Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">Full Name</label>
                                    <input
                                        name="fullName"
                                        value={form.fullName}
                                        disabled={!!user}
                                        placeholder="Enter your name"
                                        onChange={updateForm}
                                        className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 p-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all disabled:opacity-60"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email Address</label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        disabled={!!user}
                                        placeholder="you@example.com"
                                        onChange={updateForm}
                                        className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 p-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all disabled:opacity-60"
                                    />
                                </div>
                                {!user && (
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">Create Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Secure password"
                                            onChange={updateForm}
                                            className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 p-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-2 px-1 italic">We'll use this to create your premium account.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="glass p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm">2</span>
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">Street Address</label>
                                    <input name="address" placeholder="123 Luxury Lane" onChange={updateForm} className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 p-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">Phone Number</label>
                                    <input name="phone" placeholder="+234..." onChange={updateForm} className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 p-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">City</label>
                                    <input name="city" placeholder="Lagos" onChange={updateForm} className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 p-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">State / Province</label>
                                    <input name="state" placeholder="Lagos State" onChange={updateForm} className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 p-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all" />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Summary & Coupon */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass p-8 rounded-[2.5rem] sticky top-32 space-y-6">
                            <h2 className="text-2xl font-black mb-6">Order Summary</h2>

                            {/* Short List of items */}
                            <div className="max-h-40 overflow-y-auto space-y-3 mb-6 pr-2">
                                {items.map(item => (
                                    <div key={item.productId} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-gray-400 line-clamp-1 flex-1">{item.name} <span className="text-[10px] font-bold">x{item.qty}</span></span>
                                        <span className="font-bold ml-4">₦{(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Have a Coupon?</label>
                                <div className="flex gap-2">
                                    <input
                                        placeholder="CODE2024"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 bg-gray-50 dark:bg-gray-800/50 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary transition-all"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        disabled={applyingCoupon || !couponCode}
                                        className="px-4 py-2 bg-brand-dark dark:bg-brand-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-30"
                                    >
                                        {applyingCoupon ? '...' : 'Apply'}
                                    </button>
                                </div>
                                {couponError && <p className="text-[10px] text-red-500 font-bold ml-1">{couponError}</p>}
                                {couponData && (
                                    <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg border border-emerald-500/20 text-[10px] font-bold flex justify-between items-center group">
                                        <span>Coupon Applied: {couponData.coupon.code} (-{couponData.coupon.percent}%)</span>
                                        <button onClick={() => setCouponData(null)} className="hover:text-red-500">✕</button>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-brand-dark dark:text-white">₦{subtotal.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-500 text-sm">
                                        <span>Discount</span>
                                        <span className="font-bold">-₦{discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="font-bold text-brand-dark dark:text-white">₦{shipping.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl pt-4">
                                    <span className="font-black">Total</span>
                                    <span className="font-black text-brand-primary">₦{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitOrder}
                                disabled={submitting || items.length === 0}
                                className="w-full py-5 rounded-2xl bg-brand-dark dark:bg-brand-primary text-white font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                            >
                                {submitting ? 'Creating Order...' : 'Complete Payment'}
                            </button>

                            <div className="flex flex-col items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                                <span>SSL Secure Transaction</span>
                                <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                                    {/* Small payment icons placeholder */}
                                    <div className="w-8 h-5 bg-gray-200 rounded" />
                                    <div className="w-8 h-5 bg-gray-200 rounded" />
                                    <div className="w-8 h-5 bg-gray-200 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
