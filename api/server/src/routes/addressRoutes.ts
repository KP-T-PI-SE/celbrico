import { Router } from 'express';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All address operations require authentication
router.use(protect as any);

router.get('/', getAddresses as any);
router.post('/', createAddress as any);
router.put('/:id', updateAddress as any);
router.delete('/:id', deleteAddress as any);
router.patch('/:id/default', setDefaultAddress as any);

export default router;
