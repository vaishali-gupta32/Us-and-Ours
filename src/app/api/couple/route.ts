import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Couple from '@/models/Couple';
import { jwtVerify } from 'jose';

// Reusing helper logic (could be moved to utils for DRY)
async function getUserFromToken(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_change_me');
        const { payload } = await jwtVerify(token, secret);
        return payload as { userId: string, coupleId: string };
    } catch (e) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await getUserFromToken(req);
        if (!user || !user.coupleId) {
            return NextResponse.json({ error: 'Unauthorized or No Couple Found' }, { status: 401 });
        }

        const couple = await Couple.findById(user.coupleId).populate('partner1 partner2', 'name email avatar');
        if (!couple) {
            return NextResponse.json({ error: 'Couple not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            secretCode: couple.secretCode,
            partner1: couple.partner1,
            partner2: couple.partner2
        });
    } catch (error) {
        console.error("GET Couple Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
