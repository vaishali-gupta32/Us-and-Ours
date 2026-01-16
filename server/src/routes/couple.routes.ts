import express from 'express';
import { getCouple, updateCouple } from '../controllers/coupleController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getCouple);
router.patch('/', protect, updateCouple);

export default router;
