import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { requireUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  await connect();
  try {
    const payload: any = requireUserFromRequest(req); // throws if unauthenticated
    const user = await User.findById(payload.id).select('-password -__v');
    if (!user) return NextResponse.json({ user: null }, { status: 200 });
    // return minimal user
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    // Not authenticated — return user:null (200) or 401, your choice. Using 200 to simplify client handling.
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
