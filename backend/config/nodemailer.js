import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log(process.env.BREVO_USER,process.env.BREVO_PASSWORD);
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASSWORD,
  },
});

export default transporter;
