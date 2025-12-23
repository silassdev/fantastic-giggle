import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import User from '@/models/User';


export async function seedAdmin() {
    await connectDB();


    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Admin';


    if (!email || !password) return;


    const exists = await User.findOne({ email });
    if (exists) return;


    const hashed = await bcrypt.hash(password, 12);


    await User.create({
        name,
        email,
        password: hashed,
        role: 'admin',
    });


    console.log('✅ Admin seeded');
}