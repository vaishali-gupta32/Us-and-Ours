import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { jwtVerify } from 'jose';

async function getUserFromToken(req: NextRequest) { // Auth check
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_change_me');
        await jwtVerify(token, secret);
        return true;
    } catch (e) { return null; }
}

export async function GET(req: NextRequest) {
    await dbConnect();
    const events = await Event.find({});
    return NextResponse.json({ success: true, events });
}

export async function POST(req: NextRequest) {
    await dbConnect();
    if (!await getUserFromToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const event = await Event.create(body);
    return NextResponse.json({ success: true, event });
}

export async function DELETE(req: NextRequest) {
    await dbConnect();
    if (!await getUserFromToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Event.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}
