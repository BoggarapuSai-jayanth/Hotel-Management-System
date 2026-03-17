import express from 'express';
import { googleAuth, register, registerAdmin, login, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);

export default router;
