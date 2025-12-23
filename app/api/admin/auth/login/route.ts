import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
    await connect();
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ message: 'email and password required' }, { status: 400 });

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return NextResponse.json({ message: 'invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ message: 'invalid credentials' }, { status: 401 });

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

    const res = NextResponse.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
}
