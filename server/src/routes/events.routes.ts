import express from 'express';
import { getEvents, createEvent, deleteEvent } from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getEvents);
router.post('/', protect, createEvent);
router.delete('/:id', protect, deleteEvent);

export default router;
