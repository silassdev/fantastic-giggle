import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Product from '@/models/Product';
import { requireAdminFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
    await connect();
    try { requireAdminFromRequest(req); } catch (e) { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }

    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category');
    const sort = url.searchParams.get('sort') || '-createdAt';
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;

    const items = await Product.find(filter).sort(sort).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);
    return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
    await connect();
    try { requireAdminFromRequest(req); } catch (e) { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }

    const body = await req.json();
    const p = await Product.create(body);
    return NextResponse.json(p, { status: 201 });
}
