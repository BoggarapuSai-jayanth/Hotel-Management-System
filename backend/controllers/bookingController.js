import Booking from '../models/Booking.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// removed module-level razorpay initialization

// @desc    Create a booking and a Razorpay order
// @route   POST /api/bookings
// @access  Private (Mock public for demo without auth middleware)
export const createBooking = async (req, res) => {
    try {
        const { user, hotel, roomType, checkIn, checkOut, totalAmount } = req.body;

        const booking = new Booking({
            user,
            hotel,
            roomType,
            checkIn,
            checkOut,
            totalAmount
        });

        const createdBooking = await booking.save();

        const options = {
            amount: totalAmount * 100, // amount in the smallest currency unit (paise for INR)
            currency: 'INR',
            receipt: `receipt_order_${createdBooking._id}`,
        };

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create(options);

        res.status(201).json({
            booking: createdBooking,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Booking Creation Error:", error);
        res.status(500).json({ message: 'Error processing booking', error: error.message || error });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/bookings/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment is successful
            const booking = await Booking.findById(booking_id);
            if (booking) {
                booking.paymentStatus = 'completed';
                booking.razorpayOrderId = razorpay_order_id;
                booking.razorpayPaymentId = razorpay_payment_id;
                await booking.save();
                return res.status(200).json({ message: "Payment verified successfully" });
            } else {
                return res.status(404).json({ message: "Booking not found" });
            }
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/user/:userId
// @access  Private (Needs auth middleware ideally, but passing userId for demo)
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).populate('hotel');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};
