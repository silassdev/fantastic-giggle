'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { state, dispatch } = useCart();
    const { items } = state;

    const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = items.length > 0 ? 2500 : 0; // Flat shipping for premium feel
    const total = subtotal + shipping;

    const updateQuantity = (productId: string, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        if (newQty <= 0) {
            dispatch({ type: 'remove', productId });
        } else {
            dispatch({ type: 'update', productId, qty: newQty });
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50/50 dark:bg-transparent">
            <div className="container mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-brand-dark dark:text-white mb-2">Your Shopping Bag</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {items.length === 0 ? 'Your bag is empty' : `Review your ${items.reduce((a, b) => a + b.qty, 0)} items`}
                    </p>
                </header>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24 glass rounded-[3rem] border-dashed border-2 border-gray-200 dark:border-gray-800"
                    >
                        <div className="text-6xl mb-6">🛒</div>
                        <h2 className="text-2xl font-bold mb-4">Nothing here yet</h2>
                        <Link
                            href="/products"
                            className="px-8 py-3 bg-brand-primary text-white rounded-full font-bold hover:scale-105 transition-all inline-block"
                        >
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.productId}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="glass p-4 rounded-3xl flex flex-col sm:flex-row items-center gap-6"
                                    >
                                        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 p-2 border border-gray-100 dark:border-gray-800 shrink-0">
                                            <img
                                                src={item.image || '/images/placeholder.png'}
                                                alt={item.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-bold text-lg text-brand-dark dark:text-white mb-1">{item.name}</h3>
                                            <div className="text-brand-primary font-black">₦{item.price.toLocaleString()}</div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800/80 rounded-2xl p-1.5 border border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.qty, -1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-gray-700 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.qty, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-gray-700 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="sm:w-32 text-center sm:text-right">
                                            <div className="font-black text-brand-dark dark:text-white">₦{(item.price * item.qty).toLocaleString()}</div>
                                            <button
                                                onClick={() => dispatch({ type: 'remove', productId: item.productId })}
                                                className="text-xs font-bold text-red-500 hover:underline mt-1"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass p-8 rounded-[2.5rem] sticky top-32 space-y-6">
                                <h2 className="text-2xl font-black mb-6">Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-brand-dark dark:text-white">₦{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span className="font-bold text-brand-dark dark:text-white">₦{shipping.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
                                    <div className="flex justify-between items-center text-xl">
                                        <span className="font-black">Total</span>
                                        <span className="font-black text-brand-primary">₦{total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full py-5 rounded-2xl bg-brand-dark dark:bg-brand-primary text-white font-bold text-center block hover:scale-[1.02] transition-all shadow-xl shadow-brand-primary/20"
                                >
                                    Proceed to Checkout
                                </Link>

                                <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <span>SSL Secure</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
