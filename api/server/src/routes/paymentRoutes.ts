import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-order', protect as any, createPaymentOrder as any);
router.post('/verify', protect as any, verifyPayment as any);

export default router;
