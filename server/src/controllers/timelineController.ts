import { Request, Response } from 'express';
import TimelineMoment from '../models/TimelineMoment';

export const getMoments = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user || !user.coupleId) {
            res.status(404).json({ error: 'Couple not found' });
            return;
        }

        const moments = await TimelineMoment.find({ coupleId: user.coupleId }).sort({ date: 1 }); // Chronological order
        res.json(moments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const createMoment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user || !user.coupleId) {
            res.status(404).json({ error: 'Couple not found' });
            return;
        }

        const { title, description, date, image, iconType } = req.body;

        const newMoment = await TimelineMoment.create({
            coupleId: user.coupleId,
            title,
            description,
            date,
            image,
            iconType
        });

        res.status(201).json(newMoment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const deleteMoment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await TimelineMoment.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ error: 'Moment not found' });
            return;
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updateMoment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updated = await TimelineMoment.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            res.status(404).json({ error: 'Moment not found' });
            return;
        }
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
