import { Router } from 'express';
import {
  getAdminMetrics,
  getAdminOrders,
  updateOrderStatus,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminCustomers,
} from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// Strict security: Every admin route requires valid token and role === 'admin'
router.use(protect as any);
router.use(adminOnly as any);

// Metrics
router.get('/metrics', getAdminMetrics as any);

// Orders
router.get('/orders', getAdminOrders as any);
router.patch('/orders/:id/status', updateOrderStatus as any);

// Products
router.get('/products', getAdminProducts as any);
router.post('/products', createAdminProduct as any);
router.put('/products/:id', updateAdminProduct as any);
router.delete('/products/:id', deleteAdminProduct as any);

// Customers
router.get('/customers', getAdminCustomers as any);

export default router;
