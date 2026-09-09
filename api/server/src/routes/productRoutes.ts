import { Router } from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/productController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts as any);
router.get('/:id', getProductById as any);
router.post('/', protect as any, adminOnly as any, createProduct as any);

export default router;
