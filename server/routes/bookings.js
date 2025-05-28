import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookings.js';
import { validateBooking } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateBooking, createBooking);
router.get('/user', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

export default router;