'use client';
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: any[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
                <ProductCard key={p._id} product={p} />
            ))}
        </div>
    );
}