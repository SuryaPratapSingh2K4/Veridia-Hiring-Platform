import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `Veridia Hiring Platform ${process.env.SMTP_USER}`,
            to,
            subject,
            html
        });
        console.log("Email sent to: ", to);
    } catch (error) {
        console.error(error.message);
    }
};

export default sendEmail;
