'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate API call
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="container py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-brand-dark dark:text-white leading-tight tracking-tighter mb-6">
                            Let's Build <br />
                            <span className="text-brand-primary">Something Great.</span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                            Have questions about a build? Or looking for a specific component? Our expert team is ready to assist you.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-2xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                                📧
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Email Us</p>
                                <p className="text-lg font-bold text-brand-dark dark:text-white">hello@ecom-tech.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-2xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                                📍
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Visit Us</p>
                                <p className="text-lg font-bold text-brand-dark dark:text-white">Lagos, Nigeria</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-2xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                                🕒
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Working Hours</p>
                                <p className="text-lg font-bold text-brand-dark dark:text-white">Mon - Fri, 9am - 6pm</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl border-white/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-3xl rounded-full -mr-32 -mt-32"></div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                <input required type="text" placeholder="John Doe" className="w-full bg-white dark:bg-gray-800/50 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                <input required type="email" placeholder="john@example.com" className="w-full bg-white dark:bg-gray-800/50 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all outline-none" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                            <select className="w-full bg-white dark:bg-gray-800/50 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all outline-none appearance-none">
                                <option>General Inquiry</option>
                                <option>Technical Support</option>
                                <option>Order Status</option>
                                <option>Business Partnership</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                            <textarea required rows={5} placeholder="How can we help you today?" className="w-full bg-white dark:bg-gray-800/50 border-none ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all outline-none resize-none" />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>

                        <AnimatePresence>
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl text-center font-bold text-sm"
                                >
                                    Message sent successfully! We'll be in touch.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
