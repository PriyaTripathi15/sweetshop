import { Router } from 'express';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  sweetValidation
} from '../controllers/sweetController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Public routes (protected by auth)
router.get('/', authMiddleware, getAllSweets);
router.get('/search', authMiddleware, searchSweets);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, sweetValidation, createSweet);
router.put('/:id', authMiddleware, adminMiddleware, updateSweet);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSweet);
router.post('/:id/restock', authMiddleware, adminMiddleware, restockSweet);

// User routes
router.post('/:id/purchase', authMiddleware, purchaseSweet);

export default router;
