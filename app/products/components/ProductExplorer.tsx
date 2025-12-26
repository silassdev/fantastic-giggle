'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import ProductCard from '@/app/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async (search: string, pageNum: number) => {
    setLoading(true);
    try {
      const url = `/api/products?q=${encodeURIComponent(search || '')}&page=${pageNum}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const data = await res.json();

      setItems(data.items || []);
      setTotal(data.total || 0);

      // Smooth scroll to top of grid when page changes
      if (pageNum > 1 || search) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load');
    } finally {
      setTimeout(() => setLoading(false), 400); // Small delay for smoother transition
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  useEffect(() => {
    fetchProducts(debouncedQ, page);
  }, [debouncedQ, page, fetchProducts]);

  const totalPages = Math.ceil(total / limit);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (i === page - 2 || i === page + 2) {
        pages.push('...');
      }
    }

    const uniquePages = Array.from(new Set(pages));

    return (
      <div className="mt-20 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <div className="flex items-center gap-2">
          {uniquePages.map((p, i) => (
            p === '...' ? (
              <span key={`sep-${i}`} className="px-3 text-gray-400 font-black">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(Number(p))}
                className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${page === p
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-brand-primary text-gray-600 dark:text-gray-400'
                  }`}
              >
                {p}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter components..."
            className="w-full bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary transition-all outline-none"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-gray-400 uppercase tracking-widest text-[10px]">Results</span>
          <span className="px-4 py-2 rounded-xl bg-brand-primary/10 text-brand-primary">{total} items found</span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {Array.from({ length: limit }).map((_, i) => (
                <div key={i} className="glass p-4 rounded-[2rem] space-y-4 animate-pulse">
                  <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-1/4" />
                    <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {items.length > 0 ? (
                items.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-32 text-center">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-2">No components found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Container */}
      {!loading && renderPagination()}
    </div>
  );
}
