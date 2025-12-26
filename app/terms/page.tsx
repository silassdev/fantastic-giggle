'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <div className="container py-20 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-brand-dark dark:text-white tracking-tighter">
                        Terms of Service<span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Last updated: December 26, 2025</p>
                </div>

                <div className="glass p-8 md:p-12 rounded-[3.5rem] border-white/20 prose dark:prose-invert max-w-none space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-brand-dark dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">1</span>
                            Service Overview
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            By accessing ECOM, you agree to be bound by these Terms of Service. We provide a platform for purchasing high-performance computer hardware and peripherals. We reserve the right to modify or terminate services at our discretion.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-brand-dark dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">2</span>
                            Product Information & Pricing
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            While we strive for 100% accuracy, we do not warrant that product descriptions or prices are error-free. In the event of a pricing error, we reserve the right to cancel orders and provide a full refund.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-brand-dark dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">3</span>
                            Shipping & Returns
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Delivery times are estimates and not guaranteed. Returns are accepted within 14 days of delivery for hardware that is unopened and in its original packaging. Serial numbers must match our records.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-brand-dark dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">4</span>
                            Limitation of Liability
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            ECOM shall not be liable for any indirect, incidental, or consequential damages resulting from the use of products purchased through our store, including loss of data due to hardware failure.
                        </p>
                    </section>

                    <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 text-center">
                            By continuing to use our platform, you acknowledge that you have read and understood these terms.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
