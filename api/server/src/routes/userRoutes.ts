import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', protect as any, getProfile as any);
router.put('/profile', protect as any, updateProfile as any);

export default router;
