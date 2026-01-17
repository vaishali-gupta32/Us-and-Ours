import { Request, Response } from 'express';
import Event from '../models/Event';

export const getEvents = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        console.log(`[getEvents] User: ${user?.userId}, Couple: ${user?.coupleId}`);

        if (!user?.coupleId) return res.status(403).json({ error: 'Not in a couple' });

        const events = await Event.find({ coupleId: user.coupleId }).sort({ date: 1 });
        res.json({ success: true, events });
    } catch (error) {
        console.error("[getEvents Error]", error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        console.log(`[createEvent] User: ${user?.userId}, Couple: ${user?.coupleId}`);

        if (!user?.coupleId) return res.status(403).json({ error: 'Not in a couple' });

        const { title, date } = req.body;
        const event = await Event.create({ title, date, coupleId: user.coupleId });

        // Google Calendar Sync
        const { getCouple } = await import('../controllers/coupleController'); // We need couple members to sync
        const coupleModel = await import('../models/Couple');
        const userModel = await import('../models/User'); // Import Default export as User or use mongoose.model
        const { addEventToGoogleCalendar } = await import('../services/calendarService');

        const couple = await coupleModel.default.findById(user.coupleId);

        if (couple) {
            const partner1 = await userModel.default.findById(couple.partner1);
            const partner2 = couple.partner2 ? await userModel.default.findById(couple.partner2) : null;

            const evtDetails = { title, date, description: "Event from Us & Ours" };

            try {
                if (partner1) await addEventToGoogleCalendar(partner1._id.toString(), evtDetails);
                if (partner2) await addEventToGoogleCalendar(partner2._id.toString(), evtDetails);
            } catch (syncErr) {
                console.error("Google Sync Failed silently:", syncErr);
            }
        }

        res.json({ success: true, event });
    } catch (error) {
        console.error("[createEvent Error]", error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;
        console.log(`[deleteEvent] User: ${user?.userId}, Couple: ${user?.coupleId}, Event: ${id}`);

        await Event.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error("[deleteEvent Error]", error);
        res.status(500).json({ error: 'Server Error' });
    }
};
