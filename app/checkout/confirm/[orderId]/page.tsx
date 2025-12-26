'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/app/components/Loader';

export default function ConfirmPaymentPage() {
    const params = useParams();
    const orderId = params?.orderId as string;
    const router = useRouter();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) return;
        const fetchOrder = async () => {
            try {
                // We'll create a simple public API to get order summary for payment
                const res = await fetch(`/api/orders/summary/${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    async function initiatePayment(provider: 'paystack' | 'flutterwave') {
        setPaying(true);
        setError('');
        try {
            const res = await fetch(`/api/payments/${provider}/initiate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
            });
            const data = await res.json();
            if (res.ok) {
                window.location.href = provider === 'paystack' ? data.authorization_url : data.payment_link;
            } else {
                setError(data.message || 'Payment initiation failed');
                setPaying(false);
            }
        } catch (err) {
            setError('Connection error');
            setPaying(false);
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

    if (error && !order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <div className="glass p-12 rounded-[3rem] max-w-md w-full">
                    <div className="text-6xl mb-6">⚠️</div>
                    <h1 className="text-2xl font-black mb-4">Something went wrong</h1>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <button onClick={() => router.push('/products')} className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold">Return to Store</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50/50 dark:bg-transparent">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
                        📦
                    </div>
                    <h1 className="text-4xl font-black text-brand-dark dark:text-white mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 dark:text-gray-400">Order ID: <span className="font-mono text-brand-primary uppercase tracking-wider">{orderId.slice(-8)}</span></p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left: Summary Card */}
                    <div className="glass p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6">
                        <h2 className="text-xl font-bold">Order Summary</h2>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.productId} className="flex justify-between text-sm">
                                    <span className="text-gray-500">{item.name} <span className="font-bold">x{item.qty}</span></span>
                                    <span className="font-bold">₦{(item.price * item.qty).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
                            <div className="flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
                                <span>Shipping Fee</span>
                                <span>₦2,500</span>
                            </div>
                            <div className="flex justify-between items-center text-2xl pt-2">
                                <span className="font-black">Total to Pay</span>
                                <span className="font-black text-brand-primary">₦{order.total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
                            <p className="text-[10px] font-black uppercase text-brand-primary tracking-widest mb-1">Shipping To</p>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {order.shipping.address}, {order.shipping.city}, {order.shipping.state}
                            </p>
                        </div>
                    </div>

                    {/* Right: Payment Selection */}
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>

                            <div className="space-y-4">
                                <button
                                    onClick={() => initiatePayment('paystack')}
                                    disabled={paying}
                                    className="w-full group relative overflow-hidden p-6 rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 hover:border-brand-primary transition-all flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#09A5DB]/10 rounded-2xl flex items-center justify-center text-xl">
                                            💳
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-dark dark:text-white">Paystack</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cards, Transfer, USSD</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                                        →
                                    </div>
                                </button>

                                <button
                                    onClick={() => initiatePayment('flutterwave')}
                                    disabled={paying}
                                    className="w-full group relative overflow-hidden p-6 rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 hover:border-brand-primary transition-all flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#fb9129]/10 rounded-2xl flex items-center justify-center text-xl">
                                            🦋
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-dark dark:text-white">Flutterwave</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Payments, Barter</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                                        →
                                    </div>
                                </button>
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 font-bold mt-4 text-center">{error}</p>
                            )}

                            <div className="mt-8 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
                                <span className="text-xl">🛡️</span>
                                <p className="text-[10px] font-bold text-gray-500 leading-tight">
                                    Your payment is securely processed. We do not store your card details on our servers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {paying && (
                <div className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="glass p-8 rounded-[2.5rem] flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-brand-dark dark:text-white">Connecting to Gateway...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
