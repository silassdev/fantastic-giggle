'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { state } = useCart();
  const router = useRouter();

  const cartCount = state.items.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  async function handleLogout(e?: React.MouseEvent) {
    e?.preventDefault();
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}
      >
        <div className="container">
          <div className={`glass relative flex items-center justify-between px-6 py-2 rounded-[2rem] transition-all duration-500 border border-transparent ${isScrolled ? 'shadow-2xl border-white/20 dark:border-gray-800' : ''}`}>
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="shrink-0"
              >
                <Link href="/" className="group flex items-center gap-1">
                  <span className="font-black text-2xl tracking-tighter text-brand-dark dark:text-white">
                    ECOM<span className="text-brand-primary group-hover:rotate-12 inline-block transition-transform">.</span>
                  </span>
                </Link>
              </motion.div>

              <nav className="hidden xl:flex items-center gap-6">
                {['Products', 'About'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-brand-primary transition-standard relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search peripherals, components..."
                  className="w-full bg-gray-50/50 dark:bg-gray-900/50 border-none ring-1 ring-gray-200 dark:ring-gray-800 py-2.5 pl-10 pr-4 rounded-2xl text-xs focus:ring-2 focus:ring-brand-primary/50 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <button type="submit" className="hidden">Search</button>
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                {user === undefined ? (
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                ) : user ? (
                  <>
                    {/* Admin Icon */}
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="p-2.5 rounded-xl hover:bg-brand-primary/10 text-brand-dark dark:text-white hover:text-brand-primary transition-all group"
                        title="Admin Panel"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"></path></svg>
                      </Link>
                    )}

                    {/* Profile Icon */}
                    <Link
                      href="/dashboard"
                      className="p-2.5 rounded-xl hover:bg-brand-primary/10 text-brand-dark dark:text-white hover:text-brand-primary transition-all group"
                      title="User Dashboard"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </Link>

                    {/* Logout Icon */}
                    <button
                      onClick={handleLogout}
                      className="p-2.5 rounded-xl hover:bg-red-500/10 text-brand-dark dark:text-white hover:text-red-500 transition-all group"
                      title="Sign Out"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-5 py-2 rounded-full bg-brand-dark dark:bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all"
                  >
                    Join
                  </Link>
                )}

                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="relative p-2.5 rounded-xl bg-brand-primary text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-brand-dark dark:bg-white text-white dark:text-brand-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-brand-primary shadow-sm"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Spacer to prevent header from overlapping content */}
      <div className="h-24 sm:h-28"></div>
    </>
  );
}
