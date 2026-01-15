import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { name, email, password, partnerEmail } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Check if we already have 2 users? Optional restriction
        const count = await User.countDocuments();
        if (count >= 2) {
            return NextResponse.json({ error: 'This is a private space for only two people.' }, { status: 403 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            partnerEmail
        });

        return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
