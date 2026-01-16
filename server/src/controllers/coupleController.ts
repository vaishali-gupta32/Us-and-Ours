import { Request, Response } from 'express';
import Couple from '../models/Couple';
import Event from '../models/Event';
import User from '../models/User';

export const getCouple = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user || user.coupleId === null) {
            res.status(404).json({ error: 'Couple not found or User not in a couple' });
            return;
        }

        const couple = await Couple.findById(user.coupleId).populate('partner1 partner2', 'name avatar');

        if (!couple) {
            res.status(404).json({ error: 'Couple not found' });
            return;
        }

        // Explicitly return secretCode as per CTO requirement
        res.json({
            success: true,
            secretCode: couple.secretCode,
            partner1: couple.partner1,
            partner2: couple.partner2,
            nextMeetingDate: couple.nextMeetingDate,
            createdAt: couple.createdAt
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updateCouple = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user || user.coupleId === null) {
            res.status(404).json({ error: 'Couple not found' });
            return;
        }

        const { nextMeetingDate } = req.body;
        const couple = await Couple.findByIdAndUpdate(
            user.coupleId,
            { nextMeetingDate },
            { new: true }
        );

        // Sync with Calendar
        if (nextMeetingDate) {
            const dateObj = new Date(nextMeetingDate);
            if (!isNaN(dateObj.getTime())) {
                const dateStr = dateObj.toISOString().split('T')[0]; // Extract YYYY-MM-DD
                await Event.create({
                    title: "Next Date ❤️",
                    date: dateStr,
                    coupleId: user.coupleId
                });

                // Google Calendar Sync
                // Sync for both partners if they are connected
                const partner1 = await User.findById(couple.partner1);
                const partner2 = couple.partner2 ? await User.findById(couple.partner2) : null;

                const { addEventToGoogleCalendar } = await import('../services/calendarService');

                try {
                    if (partner1) {
                        await addEventToGoogleCalendar(partner1._id.toString(), {
                            title: "Next Date: Us & Ours",
                            date: dateStr,
                            description: "Time for a date! 💕"
                        });
                    }
                    if (partner2) {
                        await addEventToGoogleCalendar(partner2._id.toString(), {
                            title: "Next Date: Us & Ours",
                            date: dateStr,
                            description: "Time for a date! 💕"
                        });
                    }
                } catch (syncErr) {
                    console.error("Google Calendar Sync Failed:", syncErr);
                }
            }
        }

        res.json({ success: true, couple });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
