import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

console.log('Testing Email Configuration...');
console.log('EMAIL_USER:', user ? user : 'NOT SET');
console.log('EMAIL_PASS:', pass ? '*** SET ***' : 'NOT SET');

if (!user || !pass) {
    console.error('Missing credentials. Please check your .env file.');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
});

const mailOptions = {
    from: user,
    to: user, // Send to yourself for testing
    subject: 'LuxeStays - Test Email',
    text: 'This is a test email to verify NodeMailer configuration.'
};

console.log('Attempting to send email...');

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
    }
});
