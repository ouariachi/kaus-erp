import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "erp.local",
  port: 25,
  secure: false,
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