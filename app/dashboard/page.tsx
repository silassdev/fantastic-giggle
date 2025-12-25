'use client';
import React from 'react';
import Link from 'next/link';
import ProfileSection from './components/ProfileSection';
import OrdersSection from './components/OrdersSection';
import NotificationsSection from './components/NotificationsSection';

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-2xl font-semibold mb-6">My dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-gray-600 p-4 rounded shadow">
                    <ProfileSection />
                </div>

                <div className="lg:col-span-2 bg-gray-600 p-4 rounded shadow">
                    <OrdersSection />
                    <div className="mt-6">
                        <NotificationsSection />
                    </div>
                </div>
            </div>
        </div>
    );
}
