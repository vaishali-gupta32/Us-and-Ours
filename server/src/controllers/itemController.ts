import { Request, Response } from 'express';
import ListItem from '../models/ListItem';

export const getItems = async (req: Request, res: Response) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        // Ideally filter by coupleId too if Items are shared? 
        // Original logic was just `find(query)`. 
        // If we want isolation, we should probably check coupleId or owner?
        // But let's stick to original migration first.
        const items = await ListItem.find(query).sort({ createdAt: -1 });
        res.json({ success: true, items });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

export const createItem = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const item = await ListItem.create({
            ...req.body,
            addedBy: user?.userId
        });
        res.json({ success: true, item });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await ListItem.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const item = await ListItem.findByIdAndUpdate(id, { status }, { new: true });
        res.json({ success: true, item });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
