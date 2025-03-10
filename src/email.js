import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Error while verifying connection");
    console.log(error);
    process.exit(1);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export function sendEmail({ to, subject, html }) {
  if (!transporter) {
    throw new Error("Email transporter not initialized");
  }

  transporter.sendMail({
    from: `No Reply <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
