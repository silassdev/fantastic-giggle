'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                    {['Shop', 'About', 'Admin'].map((item) => (
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
                                placeholder="Search premium tech..."
                                className="w-64 px-4 py-2 rounded-full glass border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm transition-standard"
                            />
                            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border rounded px-1.5 hidden lg:block">⌘K</kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white transition-standard"
                        >
                            Login
                        </Link>
                        <Link
                            href="/cart"
                            className="px-5 py-2 rounded-full bg-brand-dark dark:bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary dark:hover:bg-brand-secondary transition-standard shadow-md hover:shadow-brand-primary/25"
                        >
                            Cart (0)
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
