import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { requireUserFromRequest } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validators/user';

export async function GET(req: Request) {
    await connect();
    try {
        const payload: any = requireUserFromRequest(req);
        const user = await User.findById(payload.id).select('-password -__v');
        if (!user) return NextResponse.json({ message: 'not found' }, { status: 404 });
        return NextResponse.json({ user });
    } catch (err: any) {
        return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
    }
}

export async function PUT(req: Request) {
    await connect();
    try {
        const payload: any = requireUserFromRequest(req);
        const body = await req.json();
        const parsed = updateProfileSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ message: 'invalid input', errors: parsed.error.format() }, { status: 400 });

        const updated = await User.findByIdAndUpdate(payload.id, { $set: parsed.data }, { new: true }).select('-password -__v');
        return NextResponse.json({ user: updated });
    } catch (err: any) {
        return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
    }
}
