import express from 'express';
import { createBooking, verifyPayment, getUserBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/user/:userId', getUserBookings);
router.post('/', createBooking);
router.post('/verify', verifyPayment);

export default router;
