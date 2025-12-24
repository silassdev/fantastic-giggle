'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const bg =
    type === 'success' ? 'bg-green-600' :
    type === 'error' ? 'bg-red-600' : 'bg-gray-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className={`fixed right-4 bottom-6 z-50 max-w-xs w-full ${bg} text-white px-4 py-3 rounded shadow-lg`}
    >
      <div className="text-sm">{message}</div>
      <button
        onClick={() => onClose?.()}
        className="absolute top-1 right-2 text-white/80 text-xs"
        aria-label="close"
      >
        ✕
      </button>
    </motion.div>
  );
}
