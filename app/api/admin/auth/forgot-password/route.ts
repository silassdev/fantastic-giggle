import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req: Request) {
    await connect();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: 'email required' }, { status: 400 });

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return NextResponse.json({ message: 'no admin with that email' }, { status: 404 });

    const token = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    user.resetToken = hashed;
    user.resetExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    // PRODUCTION: send email with link `${NEXT_PUBLIC_BASE_URL}/admin/reset/${token}`
    // DEV: return token so you can copy the link immediately
    return NextResponse.json({ ok: true, token });
}
