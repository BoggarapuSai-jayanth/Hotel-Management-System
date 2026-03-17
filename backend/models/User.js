import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth users
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
