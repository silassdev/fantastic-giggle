'use client';
import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from '@/app/components/ProductCard';
import Loader from '@/app/components/Loader';


function useDebounce<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  outOfStock?: boolean;
};

export default function ProductExplorer() {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q, 350);

  const [page, setPage] = useState(1);
  const limit = 12;

  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (search: string, pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/products?q=${encodeURIComponent(search || '')}&page=${pageNum}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : data);
      setTotal(typeof data.total === 'number' ? data.total : (Array.isArray(data.items) ? data.items.length : 0));
    } catch (err: any) {
      setError(err?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  // initial + search + page effects
  useEffect(() => {
    setPage(1); // reset page on new search
  }, [debouncedQ]);

  useEffect(() => {
    fetchProducts(debouncedQ, page);
  }, [debouncedQ, page, fetchProducts]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section>
      <div className="mb-4 flex items-center gap-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="w-full md:w-1/2 border px-3 py-2 rounded"
        />
        <div className="text-sm text-gray-600">Results: {total}</div>
      </div>

      {/* Loader / skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
              <div className="h-40 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">No products found.</div>
            ) : (
              items.map((p) => <ProductCard key={p._id} product={p} />)
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((s) => Math.max(1, s - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {/* small page jump: show a few pages */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((_, idx) => {
                    const pnum = Math.max(1, Math.min(totalPages, page - 2 + idx));
                    return (
                      <button
                        key={pnum}
                        onClick={() => setPage(pnum)}
                        className={`px-2 py-1 rounded ${pnum === page ? 'bg-blue-600 text-white' : 'border'}`}
                      >
                        {pnum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
