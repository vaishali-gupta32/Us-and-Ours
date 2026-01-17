import express from 'express';
import { getItems, createItem, deleteItem, updateItem } from '../controllers/itemController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getItems);
router.post('/', protect, createItem);
router.delete('/:id', protect, deleteItem);
router.put('/:id', protect, updateItem); // PATCH logic mapped to PUT or we add PATCH.

// Original client used PATCH for status. I'll add PATCH route to be safe.
router.patch('/:id', protect, updateItem);

export default router;
