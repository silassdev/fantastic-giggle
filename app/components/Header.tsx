'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
} | null;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined); // undefined = loading, null = not authed
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadMe() {
      try {
        // include credentials so cookie is sent
        const res = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' });
        const data = await res.json();
        if (!mounted) return;
        setUser(data?.user ?? null);
      } catch (err) {
        if (!mounted) return;
        setUser(null);
      }
    }
    loadMe();
    return () => { mounted = false; };
  }, []);

  async function handleLogout(e?: React.MouseEvent) {
    e?.preventDefault();
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore network error
    } finally {
      // clear client-side state and navigate to home or login
      setUser(null);
      // prefer full reload so server-side auth guards also update immediately
      router.push('/login');
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-2 shadow-lg' : 'bg-transparent py-4'
        }`}
    >
      <div className="container flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link href="/" className="group flex items-center gap-1">
            <span className="font-extrabold text-2xl tracking-tighter text-brand-dark dark:text-white">
              ECOM<span className="text-brand-primary group-hover:animate-pulse">.</span>
            </span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {['Products', 'About'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-standard relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden sm:block">
            <div className="relative group">
              <input
                name="q"
                placeholder="Search product here..."
                className="w-64 px-4 py-2 rounded-full glass border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm transition-standard"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border rounded px-1.5 hidden lg:block">⌘enter</kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* auth area */}
            <div className="flex items-center gap-3">
              {/* If user is undefined => loading; show nothing (or spinner) */}
              {user === undefined ? (
                <div className="text-sm text-gray-500">...</div>
              ) : user ? (
                // logged in
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-standard"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 transition-standard"
                  >
                    Logout
                  </button>

                  <div className="hidden sm:block px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                    {user.name || user.email.split('@')[0]}
                  </div>
                </>
              ) : (
                // not logged in
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white transition-standard"
                >
                  Login
                </Link>
              )}

              <Link
                href="/cart"
                className="px-5 py-2 rounded-full bg-brand-dark dark:bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary dark:hover:bg-brand-secondary transition-standard shadow-md hover:shadow-brand-primary/25"
              >
                Cart (0)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
