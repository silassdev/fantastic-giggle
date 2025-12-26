'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductForm({ product, onSaved }: { product: any | null, onSaved: () => void }) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState('');
    const [colors, setColors] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setSlug(product.slug || '');
            setDescription(product.description || '');
            setPrice(product.price || 0);
            setStock(product.stock || 0);
            setCategory(product.category || '');
            setImages(product.images || []);
            setTags((product.tags || []).join(', ') || '');
            setColors((product.colors || []).join(', ') || '');
        }
    }, [product]);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!name || !price) {
            setError('Name and price are required');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            name,
            slug,
            description,
            price,
            stock,
            category,
            images: images.filter(Boolean),
            tags: tags.split(',').map(s => s.trim()).filter(Boolean),
            colors: colors.split(',').map(s => s.trim()).filter(Boolean)
        };

        const url = product ? `/api/admin/products/${product._id}` : '/api/admin/products';
        const method = product ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSaved();
            } else {
                const d = await res.json();
                setError(d.message || 'Failed to save product');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName) {
            setError('Cloudinary Cloud Name is not configured. Please check your .env file.');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            for (let i = 0; i < files.length; i++) {
                const f = files[i];
                const form = new FormData();
                form.append('file', f);
                form.append('upload_preset', preset || 'unsigned_preset');

                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: form
                });

                const data = await res.json();
                if (data.secure_url) {
                    setImages(prev => [...prev, data.secure_url]);
                } else if (data.error) {
                    setError(`Upload failed: ${data.error.message}`);
                }
            }
        } catch (err) {
            setError('Failed to upload image. Please check your connection.');
        } finally {
            setUploading(false);
            // Clear input
            e.target.value = '';
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium border border-red-100 dark:border-red-900/30"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. RTX 4090 Phantom"
                        className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Custom Slug (Optional)</label>
                    <input
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        placeholder="rtx-4090-phantom"
                        className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all outline-none"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide a detailed product description..."
                    rows={4}
                    className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all outline-none resize-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₦)</label>
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all outline-none text-brand-primary font-bold" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                    <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. GPU" className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all outline-none" />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 block">Product Images</label>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    <AnimatePresence>
                        {images.map((src, i) => (
                            <motion.div
                                key={src}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 group"
                            >
                                <img src={src} className="w-full h-full object-cover" alt="product preview" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <label className={`aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input type="file" multiple onChange={handleFile} className="hidden" disabled={uploading} />
                        {uploading ? (
                            <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 mb-2"><path d="M12 4v16m8-8H4"></path></svg>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload</span>
                            </>
                        )}
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
                    <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Gaming, Pro, Wireless" className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Colors (Comma separated)</label>
                    <input value={colors} onChange={e => setColors(e.target.value)} placeholder="Black, Silver, RGB" className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all outline-none" />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || uploading}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
                {loading ? 'Saving Changes...' : (product ? 'Update Component' : 'Add to Collection')}
            </button>
        </form>
    );
}
