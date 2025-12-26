'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=12');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.items || []);
                }
            } catch (e) {
                console.error('Failed to fetch featured products', e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="glass p-4 rounded-[2rem] space-y-4 animate-pulse">
                        <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800" />
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (!loading && products.length === 0) {
        return (
            <div className="text-center py-20 glass rounded-[3rem] border-dashed border-2 border-gray-100 dark:border-gray-800">
                <p className="text-gray-500 font-medium">No products featured yet.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
            {products.map((p) => (
                <ProductCard key={p._id} product={p} />
            ))}
        </motion.div>
    );
}
