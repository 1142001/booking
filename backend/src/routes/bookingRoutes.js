import { Router } from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createBooking);
router.get('/mine', protect, getMyBookings);

router.get('/admin/all', protect, adminOnly, getAllBookings);
router.patch('/admin/:id/status', protect, adminOnly, updateBookingStatus);

export default router;
