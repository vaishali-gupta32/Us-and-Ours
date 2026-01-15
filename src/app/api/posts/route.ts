import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { jwtVerify } from 'jose';

// Helper to get full user payload including coupleId
async function getUserFromToken(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_change_me');
        const { payload } = await jwtVerify(token, secret);
        return payload as { userId: string, email: string, name: string, coupleId: string };
    } catch (e) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!user.coupleId) {
            // Fallback for legacy users or users not in a couple yet
            // Return empty or global posts? For privacy, let's return error or empty.
            // Actually, let's just return posts authored by this user for safety
            const posts = await Post.find({ author: user.userId }).populate('author', 'name avatar').sort({ date: -1 });
            return NextResponse.json({ success: true, posts });
        }

        // Scoped Query: Only posts from this Couple
        // Also ensuring sorting by date descending
        const posts = await Post.find({ coupleId: user.coupleId })
            .sort({ date: -1 })
            .limit(50)
            .populate('author', 'name avatar');

        return NextResponse.json({ success: true, posts, currentUser: user.userId });
    } catch (error) {
        console.error("GET Posts Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Enforce coupleId. If null, they cannot post.
        if (!user.coupleId) {
            return NextResponse.json({ error: 'You must be part of a Couple Room to post. Please Create or Join a room.' }, { status: 403 });
        }

        const body = await req.json().catch(e => {
            throw new Error("Payload too large or invalid JSON");
        });

        const { content, mood, images } = body;

        const post = await Post.create({
            author: user.userId,
            coupleId: user.coupleId, // Critical: Tagging with Room ID
            content,
            mood,
            images
        });

        const populatedPost = await post.populate('author', 'name avatar');

        return NextResponse.json({ success: true, post: populatedPost });
    } catch (error: any) {
        console.error("POST Post Error Details:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
