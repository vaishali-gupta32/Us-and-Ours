import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Couple from '@/models/Couple';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        // action: 'create' | 'join'
        // secretCode: required if joining
        const { name, email, password, action, secretCode } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let coupleId = null;

        if (action === 'create') {
            // Flow: Create User -> Create Couple -> Link User
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                // coupleId is null initially
            });

            const code = nanoid(6).toUpperCase();
            const newCouple = await Couple.create({
                partner1: user._id,
                secretCode: code
            });

            // Update user with coupleId
            await User.findByIdAndUpdate(user._id, { coupleId: newCouple._id });

            return NextResponse.json({ success: true, user: { name: user.name, email: user.email }, secretCode: code });

        } else if (action === 'join') {
            // Flow: Find Couple -> Check validity -> Create User -> Link Couple
            if (!secretCode) return NextResponse.json({ error: 'Secret code required' }, { status: 400 });

            const couple = await Couple.findOne({ secretCode: secretCode.toUpperCase() });
            if (!couple) return NextResponse.json({ error: 'Invalid Secret Code' }, { status: 404 });

            if (couple.partner1 && couple.partner2) {
                return NextResponse.json({ error: 'Room is full (2/2)' }, { status: 403 });
            }

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                coupleId: couple._id
            });

            await Couple.findByIdAndUpdate(couple._id, { partner2: user._id });

            return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
