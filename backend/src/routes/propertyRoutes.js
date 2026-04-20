import { Router } from 'express';
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  getPropertyStats,
  updateProperty
} from '../controllers/propertyController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getProperties);
router.get('/stats/overview', protect, adminOnly, getPropertyStats);
router.get('/:id', getPropertyById);

router.post('/', protect, adminOnly, createProperty);
router.put('/:id', protect, adminOnly, updateProperty);
router.delete('/:id', protect, adminOnly, deleteProperty);

export default router;
