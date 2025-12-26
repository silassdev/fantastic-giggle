'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    return (
        <div className="container py-20 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-brand-dark dark:text-white tracking-tighter">
                        Privacy Policy<span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Last updated: December 26, 2025</p>
                </div>

                <div className="glass p-8 md:p-12 rounded-[3.5rem] border-white/20 prose dark:prose-invert max-w-none space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-brand-dark dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">1</span>
                            Information We Collect
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, shipping address, and payment information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-brand-dark dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">2</span>
                            How We Use Your Data
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Your data is used solely to provide and improve our services. This includes processing transactions, sending order confirmations, providing technical support, and occasional marketing communications (which you can opt out of at any time).
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-brand-dark dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">3</span>
                            Data Security
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information. Your payment data is processed through secure, PCI-compliant payment gateways and is never stored directly on our servers.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-brand-dark dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">4</span>
                            Cookies & Tracking
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We use cookies to enhance your browsing experience, remember your cart items, and analyze site traffic. You can manage your cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section className="space-y-4 p-8 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
                        <h2 className="text-xl font-black text-brand-dark dark:text-white">Questions?</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            If you have any questions about this Privacy Policy, please contact our legal team at <span className="font-bold text-brand-primary underline">privacy@ecom-tech.com</span>.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
