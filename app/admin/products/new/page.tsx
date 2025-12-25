'use client';
import React from 'react';
import ProductForm from '../../components/ProductForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto px-6 py-8">
            <Link href="/admin/products" className="text-sm text-brand-primary hover:underline mb-6 inline-block font-bold uppercase tracking-widest">
                ← Back to Products
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl">
                    <h1 className="text-3xl font-black text-brand-dark dark:text-white mb-2">Add New Product</h1>
                    <p className="text-gray-500 mb-10">Fill in the details below to list a new item in your store.</p>

                    <ProductForm
                        product={null}
                        onSaved={() => router.push('/admin/products')}
                    />
                </div>
            </div>
        </div>
    );
}
