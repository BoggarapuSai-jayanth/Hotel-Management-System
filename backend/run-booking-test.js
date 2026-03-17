import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Booking from './models/Booking.js';
import Razorpay from 'razorpay';

async function run() {
    console.log("Connecting DB...");
    await connectDB();
    console.log("Testing create order...");

    try {
        const booking = new Booking({
            user: "65bad9f01234567890abcdef",
            hotel: "65badbcde1234567890abcdef", // mock hex
            roomType: "Test",
            checkIn: new Date(),
            checkOut: new Date(),
            totalAmount: 1500
        });
        const createdBooking = await booking.save();
        console.log("DB Save Success! Booking ID:", createdBooking._id);

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: 1500 * 100,
            currency: 'INR',
            receipt: `receipt_order_${createdBooking._id}`,
        };
        const order = await razorpay.orders.create(options);
        console.log("Razorpay Order Success:", order.id);
        process.exit(0);
    } catch (e) {
        console.error("TEST FAILED:", e);
        process.exit(1);
    }
}
run();
