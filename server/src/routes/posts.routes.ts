import express from 'express';
import { getPosts, createPost, deletePost, updatePost } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getPosts);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, updatePost);

export default router;
