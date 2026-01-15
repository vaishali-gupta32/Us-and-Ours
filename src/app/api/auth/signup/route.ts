import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Couple from '@/models/Couple';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { name, email, password, action, secretCode } = await req.json();

        // 1. Validation
        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let responseBody: any = {};
        let user;

        if (action === 'create') {
            // Flow: Create User -> Create Couple -> Link User
            user = await User.create({
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

            // Reload user to get fresh data
            user.coupleId = newCouple._id;

            responseBody = { success: true, user: { name: user.name, email: user.email }, secretCode: code };

        } else if (action === 'join') {
            // Flow: Find Couple -> Check validity -> Create User -> Link Couple
            if (!secretCode) return NextResponse.json({ error: 'Secret code required' }, { status: 400 });

            const couple = await Couple.findOne({ secretCode: secretCode.toUpperCase() });
            if (!couple) return NextResponse.json({ error: 'Invalid Secret Code' }, { status: 404 });

            if (couple.partner1 && couple.partner2) {
                return NextResponse.json({ error: 'Room is full (2/2)' }, { status: 403 });
            }

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                coupleId: couple._id
            });

            await Couple.findByIdAndUpdate(couple._id, { partner2: user._id });

            responseBody = { success: true, user: { name: user.name, email: user.email } };

        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // 3. Auto-Login: Generate JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_change_me');
        const token = await new SignJWT({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            coupleId: user.coupleId ? user.coupleId.toString() : null
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('30d')
            .sign(secret);

        const response = NextResponse.json(responseBody);

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
