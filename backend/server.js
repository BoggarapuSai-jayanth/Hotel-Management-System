import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',

        // Vercel Frontend URL
        'https://hotel-management-system-dun-one.vercel.app'
    ],
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Razorpay Config Route
app.get('/api/config/razorpay', (req, res) => {
    res.json({
        key_id: process.env.RAZORPAY_KEY_ID
    });
});

// Test Route
app.get('/', (req, res) => {
    res.send('Hotel Management API is running...');
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});