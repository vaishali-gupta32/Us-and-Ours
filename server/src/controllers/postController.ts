import { Request, Response } from 'express';
import Post from '../models/Post';

export const getPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user?.coupleId) {
            // Fallback: return user's own posts if not in couple
            const posts = await Post.find({ author: user?.userId }).populate('author', 'name avatar').sort({ date: -1 });
            res.json({ success: true, posts });
            return;
        }

        const posts = await Post.find({ coupleId: user.coupleId })
            .sort({ date: -1 })
            .limit(50)
            .populate('author', 'name avatar');

        res.json({ success: true, posts, currentUser: user.userId });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user?.coupleId) {
            res.status(403).json({ error: 'You must be in a couple to post.' });
            return;
        }

        const { content, mood, images } = req.body;

        const post = await Post.create({
            author: user.userId,
            coupleId: user.coupleId,
            content,
            mood,
            images // Expecting URLs now, not Base64 (enforced by Client change later)
        });

        await post.populate('author', 'name avatar');
        res.json({ success: true, post });

    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
