import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET(req: Request, context: any) {
  await connect();
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim();
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit') || '12')));
    const sortParam = url.searchParams.get('sort') || '-createdAt';
    const skip = (page - 1) * limit;
    const debug = url.searchParams.has('debug');


    const filter: any = { isActive: { $ne: false }, outOfStock: { $ne: true } };

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

    const rawTotal = await Product.countDocuments({});
    const filteredTotal = await Product.countDocuments(filter);

    const items = await Product.find(filter).sort(sortParam).skip(skip).limit(limit).lean();

    const payload: any = { items, total: filteredTotal };

    if (debug) {
      payload.__debug = {
        filter,
        rawTotal,
        filteredTotal,
        sampleRaw: await Product.findOne({}).lean(),
        sampleFiltered: items[0] || null,
      };
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    console.error('/api/products error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
