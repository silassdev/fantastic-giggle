'use client';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function CheckoutPage() {
    const { state } = useCart();
    const { items } = state;
    const [form, setForm] = useState<any>({});

    function update(e: any) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submit() {
        const res = await fetch('/api/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, form }),
        });
        const data = await res.json();
        if (res.ok) window.location.href = `/checkout/confirm/${data.orderId}`;
    }

    return (
        <div className="container mx-auto px-6 py-10 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Shipping & Account</h2>

            <input name="fullName" placeholder="Full Name" onChange={update} className="w-full border p-2 mb-2 rounded" />
            <input name="email" placeholder="Email" onChange={update} className="w-full border p-2 mb-2 rounded" />
            <input name="password" type="password" placeholder="Password" onChange={update} className="w-full border p-2 mb-2 rounded" />
            <input name="phone" placeholder="Phone" onChange={update} className="w-full border p-2 mb-2 rounded" />
            <input name="address" placeholder="Address" onChange={update} className="w-full border p-2 mb-2 rounded" />
            <input name="city" placeholder="City" onChange={update} className="w-full border p-2 mb-2 rounded" />
            <input name="state" placeholder="State" onChange={update} className="w-full border p-2 mb-2 rounded" />

            <button onClick={submit} className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
                Continue
            </button>
        </div>
    );
}
