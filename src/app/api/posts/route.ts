import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { jwtVerify } from 'jose';

// Increase payload size limit if needed, but for App Router we handle this in next.config.ts usually?
// Actually, App Router doesn't use the 'config' export for body size the same way as Pages router.
// It relies on request.json() to handle it, but we might encounter edge cases with very large strings.

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
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const posts = await Post.find({})
            .sort({ date: -1 })
            .limit(20)
            .populate('author', 'name avatar');

        return NextResponse.json({ success: true, posts });
    } catch (error) {
        console.error("GET Posts Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const userPayload = await getUserFromToken(req);
        if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Explicitly parse JSON, if it fails due to size it will throw
        const body = await req.json().catch(e => {
            console.error("JSON Parse Error:", e);
            throw new Error("Payload too large or invalid JSON");
        });

        const { content, mood, images } = body;

        const post = await Post.create({
            author: userPayload.userId,
            content,
            mood,
            images
        });

        return NextResponse.json({ success: true, post });
    } catch (error: any) {
        console.error("POST Post Error Details:", error);
        // Return the actual error message to the client for debugging
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
