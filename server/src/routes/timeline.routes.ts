import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { createMoment, deleteMoment, getMoments, updateMoment } from '../controllers/timelineController';

const router = express.Router();

router.get('/', protect, getMoments);
router.post('/', protect, createMoment);
router.delete('/:id', protect, deleteMoment);
router.patch('/:id', protect, updateMoment);

export default router;
