import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    await connect();
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ message: 'invalid' }, { status: 400 });

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetToken: hashed, resetExpires: { $gt: Date.now() }, role: 'admin' });
    if (!user) return NextResponse.json({ message: 'invalid or expired token' }, { status: 400 });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined as any;
    user.resetExpires = undefined as any;
    await user.save();

    return NextResponse.json({ ok: true });
}
