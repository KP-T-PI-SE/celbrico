import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect as any, createOrder as any);
router.get('/my-orders', protect as any, getMyOrders as any);
router.get('/:id', protect as any, getOrderById as any);

export default router;
