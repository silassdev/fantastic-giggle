import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';

export default function HomePage() {
    return (
        <div className="container pb-20">
            <Hero />

            <section className="mt-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter mb-4">
                            New Arrivals<span className="text-brand-primary">.</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md font-medium">
                            Experience the next generation of precision-engineered hardware components and peripherals.
                        </p>
                    </div>
                    <a
                        href="/products"
                        className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-brand-dark dark:text-white font-bold text-sm hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                    >
                        Explore Collection
                        <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </a>
                </div>

                <FeaturedProducts />
            </section>
        </div>
    );
}