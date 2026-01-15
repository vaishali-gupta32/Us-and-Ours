import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ListItem from '@/models/ListItem';
import { jwtVerify } from 'jose';

async function getUserFromToken(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_change_me');
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (e) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        const query = type ? { type } : {};
        const items = await ListItem.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, items });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const item = await ListItem.create({
            ...body,
            addedBy: user.userId
        });

        return NextResponse.json({ success: true, item });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        await ListItem.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { _id, status } = await req.json();
        const item = await ListItem.findByIdAndUpdate(_id, { status }, { new: true });

        return NextResponse.json({ success: true, item });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
