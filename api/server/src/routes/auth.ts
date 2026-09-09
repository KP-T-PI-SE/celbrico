import { Router } from 'express';
import { sendOTP, verifyOTP, setPin, loginPin } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/send-otp', sendOTP as any);
router.post('/verify-otp', verifyOTP as any);
router.post('/set-pin', protect as any, setPin as any);
router.post('/login-pin', loginPin as any);

export default router;
