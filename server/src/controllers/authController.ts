import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Couple from '../models/Couple';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

// Generate Token
const generateToken = (userId: string, email: string, name: string, coupleId: any) => {
    return jwt.sign(
        { userId, email, name, coupleId: coupleId ? coupleId.toString() : null },
        process.env.JWT_SECRET as string,
        { expiresIn: '30d' }
    );
};

// Set Cookie
const setCookie = (res: Response, token: string) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/'
    });
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, action, secretCode } = req.body;

        if (!email || !password || !name) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user: any;
        let responseBody: any = {};

        if (action === 'create') {
            user = await User.create({ name, email, password: hashedPassword });

            const code = crypto.randomBytes(3).toString('hex').toUpperCase();

            const newCouple = await Couple.create({
                partner1: user._id,
                secretCode: code
            });

            user.coupleId = newCouple._id;
            await user.save();

            responseBody = { success: true, user: { name: user.name, email: user.email }, secretCode: code };

        } else if (action === 'join') {
            if (!secretCode) {
                res.status(400).json({ error: 'Secret code required' });
                return;
            }

            const couple = await Couple.findOne({ secretCode: secretCode.toUpperCase() });
            if (!couple) {
                res.status(404).json({ error: 'Invalid Secret Code' });
                return;
            }

            if (couple.partner1 && couple.partner2) {
                res.status(403).json({ error: 'Room is full' });
                return;
            }

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                coupleId: couple._id
            });

            couple.partner2 = user._id;
            await couple.save();

            responseBody = { success: true, user: { name: user.name, email: user.email } };

        } else {
            res.status(400).json({ error: 'Invalid action' });
            return;
        }

        const token = generateToken(user._id, user.email, user.name, user.coupleId);
        setCookie(res, token);
        res.status(201).json(responseBody);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user._id, user.email, user.name, user.coupleId);
        setCookie(res, token);
        res.json({ success: true, user: { name: user.name, email: user.email } });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ success: true });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCloudinarySignature = (req: Request, res: Response) => {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const folder = req.query.folder as string;

    const params: any = { timestamp };
    if (folder) params.folder = folder;

    const signature = cloudinary.utils.api_sign_request(
        params,
        process.env.CLOUDINARY_API_SECRET as string
    );
    res.json({ signature, timestamp, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY });
};
