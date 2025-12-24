'use client';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function CartPage() {
    const { state } = useCart();
    const { items } = state;
    const total = items.reduce((s: number, i) => s + i.price * i.qty, 0);

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

            {items.map((item) => (
                <div key={item.productId} className="flex justify-between border-b py-3">
                    <div>
                        <div>{item.name}</div>
                        <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                    </div>
                    <div>₦{item.price * item.qty}</div>
                </div>
            ))}

            <div className="mt-6 font-bold">Total: ₦{total}</div>

            <a href="/checkout" className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded">
                Checkout
            </a>
        </div>
    );
}
