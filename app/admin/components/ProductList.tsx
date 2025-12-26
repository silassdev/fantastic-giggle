'use client';
import React from 'react';

type Product = {
  _id?: string;
  images?: string[];
  name?: string;
  price?: number;
  outOfStock?: boolean;
};

export default function ProductList({
  products,
  onEdit,
  onDeleted,
  onToggleSell,
}: {
  products: any;
  onEdit: (p: any) => void;
  onDeleted: () => void;
  onToggleSell: () => void;
}) {
  // normalize: allow either an array or an object { items, total }
  const list: Product[] = Array.isArray(products)
    ? products
    : products && Array.isArray(products.items)
    ? products.items
    : [];

  async function del(id: string) {
    if (!confirm('Delete product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) onDeleted();
  }

  async function toggleSell(p: any) {
    const updated = { ...p, outOfStock: !p.outOfStock };
    const res = await fetch(`/api/admin/products/${p._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) onToggleSell();
  }

  if (!list.length) {
    return <div className="text-sm text-gray-500">No products to display.</div>;
  }

  return (
    <div className="space-y-3">
      {list.map((p) => (
        <div key={p._id} className="flex items-center justify-between border-b py-2">
          <div className="flex items-center gap-3">
            <img src={p.images?.[0] || '/images/keyboard.png'} className="w-12 h-12 object-cover rounded" alt={p.name || 'product'} />
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500">₦{p.price}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`px-2 py-1 text-sm border rounded ${p.outOfStock ? 'bg-red-50' : ''}`}
              onClick={() => toggleSell(p)}
            >
              {p.outOfStock ? 'Mark sellable' : 'Mark out of sell'}
            </button>
            <button className="px-2 py-1 text-sm border rounded" onClick={() => onEdit(p)}>
              Edit
            </button>
            <button className="px-2 py-1 text-sm border rounded text-red-600" onClick={() => del(p._id!)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
