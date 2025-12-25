'use client';
import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    async function loadProducts() {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
            const data = await res.json();
            setProducts(data);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-brand-dark dark:text-white">Manage Products</h1>
                <button
                    onClick={() => { setEditingProduct(null); setShowForm(true); }}
                    className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-secondary transition-all"
                >
                    Add Product
                </button>
            </div>

            {showForm ? (
                <div className="glass p-8 rounded-3xl border border-white/20 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white">
                            {editingProduct ? 'Edit Product' : 'Create New Product'}
                        </h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-brand-dark">Close</button>
                    </div>
                    <ProductForm
                        product={editingProduct}
                        onSaved={() => { setShowForm(false); loadProducts(); }}
                    />
                </div>
            ) : null}

            <div className="glass p-8 rounded-3xl border border-white/20">
                <ProductList
                    products={products}
                    onEdit={(p) => { setEditingProduct(p); setShowForm(true); }}
                    onDeleted={loadProducts}
                    onToggleSell={loadProducts}
                />
            </div>
        </div>
    );
}
