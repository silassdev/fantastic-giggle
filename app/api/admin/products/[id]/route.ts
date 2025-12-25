import { NextResponse } from 'next/server';
import connect from '../../../../../lib/mongoose';
import Product from '../../../../../models/Product';
import { requireAdminFromRequest } from '../../../../../lib/auth';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connect();
    try { requireAdminFromRequest(req); } catch (e) { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: 'invalid id' }, { status: 400 });
    const p = await Product.findById(id);
    if (!p) return NextResponse.json({ message: 'not found' }, { status: 404 });
    return NextResponse.json(p);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connect();
    try { requireAdminFromRequest(req); } catch (e) { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }
    const { id } = await params;
    const body = await req.json();
    const updated = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ message: 'not found' }, { status: 404 });
    return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connect();
    try { requireAdminFromRequest(req); } catch (e) { return NextResponse.json({ message: 'unauth' }, { status: 401 }); }
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ ok: true, id });
}
