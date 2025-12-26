'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrdersSection() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch('/api/user/orders');
    if (!res.ok) return;
    const d = await res.json();
    setOrders(d.items || []);
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Orders</h3>
      {orders.length === 0 ? <div>No orders yet</div> : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o._id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">Order {o._id}</div>
                <div className="text-sm text-gray-600">Status: {o.status} | Tracking: {o.trackingStatus || '—'}</div>
                <div className="text-sm">Total: ₦{o.total}</div>
              </div>
              <div>
                <Link href={`/dashboard/orders/${o._id}`} className="px-3 py-1 border rounded text-sm inline-block">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
