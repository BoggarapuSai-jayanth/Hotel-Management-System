import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;

        // If no credentials are provided in .env, mock the email send for testing purposes
        if (!user || !pass) {
            console.log('-------------------------------------------------------');
            console.log('📧 DEVELOPMENT MODE: Email sending mocked.');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message:\n${text}`);
            console.log('-------------------------------------------------------');
            console.log('⚠️ To send real emails, add EMAIL_USER and EMAIL_PASS to backend/.env');
            return true;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass }
        });

        const mailOptions = {
            from: user,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        return false;
    }
};

export default sendEmail;
