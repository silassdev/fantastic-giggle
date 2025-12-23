import React from 'react';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';

export default async function HomePage() {
    let products: any[] = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ''}/api/products`, { cache: 'no-store' });
        if (res.ok) products = await res.json();
    } catch (e) {
        // Fallback to static products
    }

    if (!products || !products.length) {
        products = [
            { _id: '1', name: 'Mechanical Keyboard – RGB', description: 'Hot-swap mechanical switches, customizable macros', price: 8500, images: ['/images/keyboard.png'] },
            { _id: '2', name: 'Gaming Mouse', description: 'High DPI, ergonomic for long sessions', price: 4500, images: ['/images/gaming_mouse.png'] },
            { _id: '3', name: '27" 144Hz Monitor', description: 'IPS, fast refresh, adaptive sync', price: 55000, images: ['/images/144Hz_monitor.png'] },
            { _id: '4', name: 'USB-C Dock', description: 'Power, HDMI, LAN — compact', price: 22000, images: ['/images/usb-c_dock.png'] },
        ];
    }

    return (
        <div className="container py-10">
            <Hero />
            <section className="mt-20">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-brand-dark dark:text-white tracking-tight">Featured Products</h2>
                    <a href="/products" className="text-sm font-bold text-brand-primary hover:underline uppercase tracking-widest">See all</a>
                </div>
                <ProductGrid products={products.slice(0, 8)} />
            </section>
        </div>
    );
}