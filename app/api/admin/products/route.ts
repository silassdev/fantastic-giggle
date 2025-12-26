import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Product from '@/models/Product';
import { requireAdminFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  await connect();
  try {
    requireAdminFromRequest(req);
  } catch {
    return NextResponse.json({ message: 'unauth' }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category');
  const sort = url.searchParams.get('sort') || '-createdAt';
  const page = Number(url.searchParams.get('page') || '1');
  const limit = Number(url.searchParams.get('limit') || '50');
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (q) {
    const keywords = q.split(/\s+/).filter(k => k.length > 0);
    if (keywords.length > 0) {
      filter.$and = keywords.map(word => {
        const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        return {
          $or: [
            { name: re },
            { description: re },
            { slug: re },
            { tags: re },
            { category: re }
          ]
        };
      });
    }
  }
  if (category) filter.category = category;

  const items = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);
  return NextResponse.json({ items, total });
}


export async function POST(req: Request) {
  await connect();
  try {
    requireAdminFromRequest(req);
  } catch {
    return NextResponse.json({ message: 'unauth' }, { status: 401 });
  }

  const body = await req.json();

  // Whitelist fields (prevents junk / malicious payloads)
  const pBody = {
    name: body.name,
    slug: body.slug || body.name.toLowerCase().split(' ').join('_'),
    description: body.description || '',
    price: Number(body.price) || 0,
    images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
    stock: Number(body.stock) || 0,
    category: body.category || '',
    tags: Array.isArray(body.tags) ? body.tags : [],
    colors: Array.isArray(body.colors) ? body.colors : [],

    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    outOfStock:
      body.outOfStock !== undefined ? Boolean(body.outOfStock) : false,
  };

  const product = await Product.create(pBody);

  return NextResponse.json(product, { status: 201 });
}
