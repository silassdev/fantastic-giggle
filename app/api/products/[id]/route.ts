import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connect();
    try {
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
        }
        const product = await Product.findById(id).lean();
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (err: any) {
        console.error('API Product GET Error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
