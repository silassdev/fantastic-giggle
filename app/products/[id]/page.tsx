'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import Loader from '@/app/components/Loader';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { dispatch } = useCart();

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">The product you are looking for doesn't exist or has been removed.</p>
                <a href="/products" className="px-6 py-3 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-all">
                    Back to Products
                </a>
            </div>
        );
    }

    const handleAddToCart = () => {
        dispatch({
            type: 'add',
            item: {
                productId: product._id,
                name: product.name,
                price: product.price,
                qty: 1,
                image: product.images?.[0]
            }
        });
        // Optional: add a toast notification here
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800"
                    >
                        <img
                            src={product.images?.[0] || '/images/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-700"
                        />
                    </motion.div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full"
                    >
                        <div className="mb-8">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
                                {product.category || 'Premium Component'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-white mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-black text-brand-primary">
                                    ₦{product.price.toLocaleString()}
                                </span>
                                {product.stock > 0 ? (
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg border border-emerald-500/20">
                                        In Stock ({product.stock})
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg border border-red-500/20">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-auto space-y-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="w-full py-5 px-8 rounded-2xl bg-brand-dark dark:bg-brand-primary text-white font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                                Add to Shopping Bag
                            </button>
                        </div>

                        {/* Features/Badges */}
                        <div className="grid grid-cols-2 gap-4 mt-12">
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                <div className="text-brand-primary mb-2">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <div className="font-bold text-sm">Secure Payment</div>
                                <div className="text-xs text-gray-500">100% Protected</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                <div className="text-brand-primary mb-2">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div className="font-bold text-sm">Fast Delivery</div>
                                <div className="text-xs text-gray-500">Express Shipping</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
