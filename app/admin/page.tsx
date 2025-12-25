'use client';
import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const cards = [
        { title: 'Products', count: 'Manage', link: '/admin/products', color: 'bg-blue-500' },
        { title: 'Orders', count: 'View', link: '/admin/orders', color: 'bg-green-500' },
        { title: 'Coupons', count: 'Edit', link: '/admin/coupons', color: 'bg-purple-500' },
        { title: 'Notifications', count: 'Browse', link: '/admin/notifications', color: 'bg-orange-500' },
    ];

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 text-brand-dark dark:text-white">Admin Control Panel</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <Link key={card.title} href={card.link}>
                        <div className="glass p-6 rounded-2xl hover:shadow-xl transition-all cursor-pointer border border-white/20">
                            <div className={`${card.color} w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white shadow-lg`}>
                                {/* Basic Icon representation */}
                                <span className="font-bold">{card.title[0]}</span>
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark dark:text-white">{card.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">{card.count}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/20">
                    <h2 className="text-2xl font-bold mb-4 text-brand-dark dark:text-white">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link href="/admin/products/new" className="block w-full py-3 px-6 bg-brand-primary text-white rounded-xl font-bold text-center hover:bg-brand-secondary transition-all">
                            Add New Product
                        </Link>
                        <Link href="/admin/coupons/new" className="block w-full py-3 px-6 bg-brand-dark dark:bg-gray-800 text-white rounded-xl font-bold text-center hover:opacity-90 transition-all border border-white/10">
                            Generate Coupon
                        </Link>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/20 flex items-center justify-center text-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-brand-dark dark:text-white">System Status</h2>
                        <div className="flex items-center justify-center gap-2 text-green-500 font-bold">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            Operational
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xs">
                            All systems are running smoothly. Database connection is active.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
