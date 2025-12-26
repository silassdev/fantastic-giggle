'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Toast from '@/app/components/Toast'
import { useAuth } from '../context/AuthContext';


export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        const message = data?.message || `Login failed (${res.status})`;
        setToast({ msg: message, type: 'error' });
        setLoading(false);
        return;
      }

      // Update global auth state
      if (data?.user) {
        login(data.user);
      }

      setToast({ msg: 'Login successful', type: 'success' });
      const role = data?.user?.role;
      setTimeout(() => {
        if (role === 'admin') router.push('/admin');
        else router.push('/');
      }, 500);
    } catch (err: any) {
      setToast({ msg: err?.message || 'Network error', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="absolute top-1/4 left-1/4 -z-10 w-64 h-64 bg-brand-primary/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 w-64 h-64 bg-brand-secondary/10 blur-3xl rounded-full"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-white/50 dark:border-gray-800">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block mb-4">
              <span className="font-black text-3xl tracking-tighter text-brand-dark dark:text-white">
                ECOM<span className="text-brand-primary">.</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-brand-dark dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
            <div>
              <label className="block text-sm font-bold text-brand-dark dark:text-gray-300 mb-2 ml-1">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full px-5 py-4 rounded-2xl border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-brand-dark dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-standard outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder="name@company.com"
                autoComplete="email"
                aria-label="Email address"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-sm font-bold text-brand-dark dark:text-gray-300">Password</label>
                <Link href="#" className="text-xs font-semibold text-brand-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="w-full px-5 py-4 rounded-2xl border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-brand-dark dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-standard outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-label="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-brand-dark dark:bg-brand-primary text-white font-bold transition-standard hover:bg-brand-primary dark:hover:bg-brand-secondary shadow-lg shadow-brand-dark/20 dark:shadow-brand-primary/20 hover:shadow-brand-primary/30 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-brand-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

