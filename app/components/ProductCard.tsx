'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-3xl p-4 transition-standard hover:shadow-2xl hover:shadow-brand-primary/10 border border-gray-100"
    >
      <Link
        href={`/products/${product._id}`}
        className="block no-underline"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-square rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden mb-4 group-hover:bg-brand-light transition-standard">
          <img
            src={product.images?.[0] || '/images/placeholder.png'}
            alt={product.name}
            className="object-contain h-4/5 w-4/5 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-standard">
            <div className="w-8 h-8 rounded-full glass bg-white/50 flex items-center justify-center text-brand-dark">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-brand-dark group-hover:text-brand-primary transition-standard">{product.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="font-black text-lg text-brand-dark">₦{product.price.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 uppercase">Premium</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
