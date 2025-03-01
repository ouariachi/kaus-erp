import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `No Reply <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}