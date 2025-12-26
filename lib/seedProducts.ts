import connect from './mongoose';
import Product from '@/models/Product';

const sampleProducts = [
    {
        name: "RTX 4090 Phantom Edition",
        description: "Ultimate graphical performance with 24GB GDDR6X, triple fan setup, and stealth black aesthetic.",
        price: 1850000,
        images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800"],
        stock: 5,
        category: "GPU",
        isActive: true
    },
    {
        name: "Apex Pro TKL Wireless",
        description: "OmniPoint 2.0 adjustable switches, ultra-low latency wireless, and aircraft-grade aluminum top plate.",
        price: 185000,
        images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800"],
        stock: 12,
        category: "Keyboard",
        isActive: true
    },
    {
        name: "Odyssey Neo G9",
        description: "49-inch curved gaming monitor with Quantum Mini-LED, 240Hz refresh rate, and 1ms GtG response.",
        price: 950000,
        images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800"],
        stock: 3,
        category: "Monitor",
        isActive: true
    },
    {
        name: "Logitech G Pro X Superlight 2",
        description: "The world's lightest wireless pro gaming mouse at 60g, LIGHTFORCE hybrid switches, and HERO 2 sensor.",
        price: 125000,
        images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800"],
        stock: 20,
        category: "Mouse",
        isActive: true
    },
    {
        name: "Corsair Dominator Titanium 64GB",
        description: "Extreme DDR5 performance with customizable top bars, DHX cooling, and high-frequency 7200MT/s.",
        price: 245000,
        images: ["https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=800"],
        stock: 15,
        category: "RAM",
        isActive: true
    },
    {
        name: "Core i9-14900KS Special Edition",
        description: "The fastest desktop processor in the world, with 6.2GHz turbo frequency and 24 cores (8P + 16E).",
        price: 685000,
        images: ["https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=800"],
        stock: 8,
        category: "CPU",
        isActive: true
    },
    {
        name: "ROG Maximus Z790 Dark Hero",
        description: "WIFI 7 support, PCIe 5.0, robust power delivery, and sleek dark aesthetic for extreme overclocking.",
        price: 495000,
        images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800"],
        stock: 10,
        category: "Motherboard",
        isActive: true
    },
    {
        name: "Lian Li O11 Dynamic EVO XL",
        description: "Versatile modular full-tower chassis with panoramic glass and support for triple 420mm radiators.",
        price: 185000,
        images: ["https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800"],
        stock: 6,
        category: "Case",
        isActive: true
    },
    {
        name: "Samsung 990 Pro 4TB",
        description: "Ultimate NVMe Gen4 speed with heatsink, 7450 MB/s reads, and high random I/O performance.",
        price: 315000,
        images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800"],
        stock: 25,
        category: "SSD",
        isActive: true
    },
    {
        name: "Arctic Nova Pro Wireless",
        description: "Multi-system gaming headset with active noise cancellation and hot-swap battery system.",
        price: 265000,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"],
        stock: 14,
        category: "Audio",
        isActive: true
    },
    {
        name: "Elgato Stream Deck MK.2",
        description: "15 customizable LCD keys to control apps, tools, and platforms on the fly. Swap faceplates.",
        price: 115000,
        images: ["https://images.unsplash.com/photo-1590212151175-e58edd96d85c?q=80&w=800"],
        stock: 18,
        category: "Streaming",
        isActive: true
    },
    {
        name: "Secretlab TITAN Evo 2022",
        description: "Award-winning ergonomic comfort with magnetic neck pillow and 4-way L-ADAPT lumbar support.",
        price: 485000,
        images: ["https://images.unsplash.com/photo-1598550476439-68426038df80?q=80&w=800"],
        stock: 10,
        category: "Furniture",
        isActive: true
    },
    {
        name: "Asus ROG Swift PG32UCDM",
        description: "32-inch 4K QD-OLED gaming monitor with 240Hz refresh rate and unparalleled color accuracy.",
        price: 1100000,
        images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"],
        stock: 4,
        category: "Monitor",
        isActive: true
    },
    {
        name: "Keychron Q1 Max",
        description: "Full metal 75% layout keyboard with double-shot PBT keycaps and triple connectivity options.",
        price: 165000,
        images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800"],
        stock: 7,
        category: "Keyboard",
        isActive: true
    },
    {
        name: "NZXT Kraken Elite 360",
        description: "High-performance liquid cooler with customizable LCD display for GIFs and real-time specs.",
        price: 215000,
        images: ["https://images.unsplash.com/photo-1580234797602-22c37b2a6230?q=80&w=800"],
        stock: 12,
        category: "Cooling",
        isActive: true
    },
    {
        name: "Razer Viper V3 Pro",
        description: "8000Hz polling rate wireless gaming mouse with Focus Pro 35K optical sensor.",
        price: 135000,
        images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800"],
        stock: 22,
        category: "Mouse",
        isActive: true
    },
    {
        name: "Crucial T705 2TB NVMe",
        description: "World leading Gen5 SSD speed at 14,500 MB/s, designed for enthusiasts and creators.",
        price: 285000,
        images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800"],
        stock: 9,
        category: "SSD",
        isActive: true
    },
    {
        name: "Glorious Model O 2 Wireless",
        description: "Ultralight ambidextrous mouse with honeycomb shell and 210 hours of battery life.",
        price: 75000,
        images: ["https://images.unsplash.com/photo-1629429408209-1f912961dbd8?q=80&w=800"],
        stock: 30,
        category: "Mouse",
        isActive: true
    },
    {
        name: "Wooting 60HE",
        description: "The original analog gaming keyboard for maximum competitive advantage with rapid trigger.",
        price: 175000,
        images: ["https://images.unsplash.com/photo-1618384881928-bbcd77732d20?q=80&w=800"],
        stock: 5,
        category: "Keyboard",
        isActive: true
    },
    {
        name: "Fractal Design North Charcoal",
        description: "Sophisticated PC case with genuine walnut front panel and open mesh side panels.",
        price: 145000,
        images: ["https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800"],
        stock: 11,
        category: "Case",
        isActive: true
    },
    {
        name: "Shure SM7B Dynamic Mic",
        description: "The gold standard for studio recording, streaming, and podcasting with smooth frequency response.",
        price: 345000,
        images: ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800"],
        stock: 6,
        category: "Audio",
        isActive: true
    },
    {
        name: "Elgato Facecam Pro",
        description: "The first true 4K 60fps webcam with a studio-grade lens and advanced image sensor.",
        price: 225000,
        images: ["https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800"],
        stock: 13,
        category: "Streaming",
        isActive: true
    },
    {
        name: "Crucial Pro Overclocking 32GB",
        description: "DDR5 memory capable of reaching 6000MT/s with low-latency Intel XMP 3.0 support.",
        price: 115000,
        images: ["https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=800"],
        stock: 20,
        category: "RAM",
        isActive: true
    },
    {
        name: "WD Black SN850X 2TB",
        description: "Top-tier PCIe Gen4 storage optimized for hardcore gaming with optional heatsink.",
        price: 145000,
        images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800"],
        stock: 18,
        category: "SSD",
        isActive: true
    },
    {
        name: "ASUS ROG Azoth Keyboard",
        description: "75% wireless custom DIY gaming keyboard with OLED display and hot-swappable switches.",
        price: 195000,
        images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800"],
        stock: 6,
        category: "Keyboard",
        isActive: true
    }
];

export async function seedProducts() {
    await connect();

    // Only seed if database is sparse
    const count = await Product.countDocuments();
    if (count >= 20) {
        console.log('⏭️ Skipping product seeding (already populated)');
        return;
    }

    try {
        // Generate slugs and prepare data
        const preparedProducts = sampleProducts.map(p => ({
            ...p,
            slug: p.name.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '')
        }));

        await Product.insertMany(preparedProducts);
        console.log('✅ 25 Premium products seeded successfully');
    } catch (err) {
        console.error('❌ Failed to seed products:', err);
    }
}
