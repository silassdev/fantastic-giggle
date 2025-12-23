'use client';
import React, { useEffect, useState } from 'react';

export default function ProductForm({ product, onSaved }: { product: any | null, onSaved: () => void }) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState('');
    const [colors, setColors] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name || ''); setSlug(product.slug || ''); setDescription(product.description || '');
            setPrice(product.price || 0); setStock(product.stock || 0);
            setImages(product.images || []); setTags((product.tags || []).join(',') || ''); setColors((product.colors || []).join(',') || '');
        }
    }, [product]);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const payload: any = { name, slug, description, price, stock, images, tags: tags.split(',').map(s => s.trim()).filter(Boolean), colors: colors.split(',').map(s => s.trim()).filter(Boolean) };
        const url = product ? `/api/admin/products/${product._id}` : '/api/admin/products';
        const method = product ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setLoading(false);
        if (res.ok) onSaved(); else { const d = await res.json(); alert(d.message || 'error'); }
    }

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const form = new FormData();
        form.append('file', f);
        form.append('upload_preset', preset || 'unsigned_preset');
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
        const data = await res.json();
        setImages(prev => [...prev, data.secure_url]);
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="name" className="w-full border px-3 py-2 rounded" />
            <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug" className="w-full border px-3 py-2 rounded" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="description" className="w-full border px-3 py-2 rounded" />
            <div className="flex gap-2">
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="price" className="w-1/2 border px-3 py-2 rounded" />
                <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} placeholder="stock" className="w-1/2 border px-3 py-2 rounded" />
            </div>
            <input type="file" onChange={handleFile} />
            <div className="flex gap-2 flex-wrap">
                {images.map((src, i) => <img key={i} src={src} className="w-16 h-16 object-cover rounded" />)}
            </div>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tags (comma)" className="w-full border px-3 py-2 rounded" />
            <input value={colors} onChange={e => setColors(e.target.value)} placeholder="colors (comma)" className="w-full border px-3 py-2 rounded" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{product ? 'Update' : 'Create'}</button>
        </form>
    );
}
