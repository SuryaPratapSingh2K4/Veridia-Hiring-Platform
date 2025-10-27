import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        });
        const mailOptions = {
        from: `Veridia Hiring <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: message,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(error.message);
    }
};

export default sendEmail;
