'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                window.location.href = '/login';
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="absolute top-1/4 right-1/4 -z-10 w-64 h-64 bg-brand-primary/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/4 -z-10 w-64 h-64 bg-brand-secondary/10 blur-3xl rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-white/50 dark:border-gray-800">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-6">
                            <span className="font-black text-3xl tracking-tighter text-brand-dark dark:text-white">
                                ECOM<span className="text-brand-primary">.</span>
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-brand-dark dark:text-white">Create account</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Join our premium community today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-brand-dark dark:text-gray-300 mb-2 ml-1">Full Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                required
                                className="w-full px-5 py-4 rounded-2xl border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-brand-dark dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-standard outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-dark dark:text-gray-300 mb-2 ml-1">Email Address</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                                className="w-full px-5 py-4 rounded-2xl border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-brand-dark dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-standard outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-dark dark:text-gray-300 mb-2 ml-1">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                required
                                className="w-full px-5 py-4 rounded-2xl border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-brand-dark dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-standard outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center gap-2 ml-1">
                            <input type="checkbox" id="terms" className="rounded-md border-gray-300 text-brand-primary focus:ring-brand-primary" required />
                            <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-400">
                                I agree to the <Link href="#" className="font-bold text-brand-dark dark:text-white hover:underline">Terms</Link> and <Link href="#" className="font-bold text-brand-dark dark:text-white hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl bg-brand-dark dark:bg-brand-primary text-white font-bold transition-standard hover:bg-brand-primary dark:hover:bg-brand-secondary shadow-lg shadow-brand-dark/20 dark:shadow-brand-primary/20 hover:shadow-brand-primary/30 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating account...' : 'Get Started'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-brand-primary hover:underline">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
