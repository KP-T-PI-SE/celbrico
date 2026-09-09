import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories as any);
router.post('/', protect as any, adminOnly as any, createCategory as any);

export default router;
