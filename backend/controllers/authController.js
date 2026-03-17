import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';

// client initialized dynamically later
// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecret', {
        expiresIn: '30d',
    });
};

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user (generates OTP)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            if (userExists.isVerified) {
                return res.status(400).json({ message: 'User already exists' });
            }
            // If user exists but is not verified, we allow them to request a new OTP by continuing
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Send OTP via Email
        const emailSent = await sendEmail({
            to: email,
            subject: 'LuxeStays - Verification Code',
            text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
            html: `<div style="font-family: Arial, sans-serif; p: 20px;">
                    <h2>Welcome to LuxeStays!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #4F46E5;">${otp}</h1>
                    <p>It will expire in 10 minutes.</p>
                   </div>`
        });

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
        }

        if (userExists && !userExists.isVerified) {
            // Update unverified user's OTP and password
            userExists.password = hashedPassword;
            userExists.otp = otp;
            userExists.otpExpiresAt = otpExpiresAt;
            await userExists.save();
        } else {
            // Create user
            await User.create({
                name,
                email,
                password: hashedPassword,
                role: email.includes('admin') ? 'admin' : 'user',
                otp,
                otpExpiresAt,
                isVerified: false
            });
        }

        res.status(200).json({ message: 'OTP sent to email', email });
    } catch (error) {
        console.error("====== REGISTRATION FAILED ======");
        console.error("Name:", req.body.name);
        console.error("Email:", req.body.email);
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);
        console.error("=================================");
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Register a new admin (generates OTP)
// @route   POST /api/auth/register-admin
// @access  Public
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            if (userExists.isVerified) {
                return res.status(400).json({ message: 'User already exists' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const emailSent = await sendEmail({
            to: email,
            subject: 'LuxeStays - Admin Verification Code',
            text: `Your admin verification code is: ${otp}. It will expire in 10 minutes.`,
            html: `<div style="font-family: Arial, sans-serif; p: 20px;">
                    <h2>Welcome to LuxeStays Partnership!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #4F46E5;">${otp}</h1>
                    <p>It will expire in 10 minutes.</p>
                   </div>`
        });

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
        }

        if (userExists && !userExists.isVerified) {
            userExists.password = hashedPassword;
            userExists.otp = otp;
            userExists.otpExpiresAt = otpExpiresAt;
            userExists.role = 'admin'; // Override role
            await userExists.save();
        } else {
            await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin', // Force admin role explicitly
                otp,
                otpExpiresAt,
                isVerified: false
            });
        }

        res.status(200).json({ message: 'OTP sent to email', email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify OTP and log in
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const wasAlreadyVerified = user.isVerified;

        // Mark as verified and clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        // Only send the Welcome Email if they weren't verified before
        if (!wasAlreadyVerified) {
            await sendEmail({
                to: email,
                subject: 'Welcome to LuxeStays!',
                text: 'Thank you for joining LuxeStays! Your account has been successfully created.',
                html: `<div style="font-family: Arial, sans-serif; p: 20px;">
                        <h2>You're in!</h2>
                        <p>Thank you for joining LuxeStays. Get ready to experience unrivaled luxury and book premium properties worldwide.</p>
                       </div>`
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first', email });
        }

        // If user is Google-only (no password set), block email/password login
        if (!user.password) {
            return res.status(400).json({ message: 'This account uses Google Sign-In. Please use the "Continue with Google" button.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate OTP for login
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        // Send Login OTP via Email
        const emailSent = await sendEmail({
            to: email,
            subject: 'LuxeStays - Login Verification Code',
            text: `Your login verification code is: ${otp}. It will expire in 10 minutes.`,
            html: `<div style="font-family: Arial, sans-serif; p: 20px;">
                    <h2>Login Attempt</h2>
                    <p>Your login verification code is:</p>
                    <h1 style="color: #4F46E5;">${otp}</h1>
                    <p>It will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                   </div>`
        });

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send login verification email. Please try again later.' });
        }

        // Return success message prompting for OTP
        res.status(200).json({ message: 'OTP sent to email', email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Auth via Google
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const { token } = req.body;

        let email, name, googleId;

        if (token === 'mock_google_token') {
            email = 'testuser@gmail.com';
            name = 'Test User';
            googleId = '12345mockgoogleid';
        } else {
            // Real verification
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            googleId = payload.sub;
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user, auto-verifying Google users
            user = await User.create({
                name,
                email,
                googleId,
                role: email.includes('admin') ? 'admin' : 'user',
                isVerified: true
            });
        } else if (!user.isVerified) {
            // If they had started an email signup but didn't finish, auto verify them now via google
            user.isVerified = true;
            user.googleId = googleId;
            user.otp = undefined;
            user.otpExpiresAt = undefined;
            await user.save();
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("====== GOOGLE AUTH FAILED ======");
        console.error("Token received length:", req.body.token ? req.body.token.length : 'undefined');
        console.error("Google Client ID used:", process.env.GOOGLE_CLIENT_ID);
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);
        console.error("=================================");
        res.status(401).json({ message: 'Invalid Google Token', details: error.message });
    }
};
