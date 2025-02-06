import { deleteEmailVerificationToken, getEmailVerificationToken, updateEmailVerificationToken } from "../models/emailVerificationToken.js";
import { getUserByEmail, updateUser } from "../models/user.js";
import { sendEmailVerificationToken } from "../services/email.js";

const HOUR = 60 * 60 * 1000; // 1 hour
const EXPIRATION_TIME = 24 * HOUR;

export async function emailVerification(req, res) {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const emailVerificationToken = await getEmailVerificationToken(token);
  if (!emailVerificationToken) {
    return res.status(400).json({ message: "Invalid token" });
  }
  
  if (emailVerificationToken.user.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  if (emailVerificationToken.user.email !== email) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (emailVerificationToken.createdAt.getTime() + EXPIRATION_TIME < Date.now()) {
    return res.status(400).json({ message: "Token expired" });
  }

  await updateUser(emailVerificationToken.user.id, {
    emailVerified: true,
  });

  await deleteEmailVerificationToken(token);

  return res.status(200).json({ message: "Email verified successfully" });
}

const TOKEN_RESEND_INTERVALS = [ 0.5 * HOUR, 1 * HOUR, 5 * HOUR, 12 * HOUR ];

export async function resendEmailVerification(req, res) {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const user = await getUserByEmail(email, { emailVerificationToken: true });
  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (user.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  if (user.emailVerificationToken.length === 0) {
    await sendEmailVerificationToken(user.email);
    return res.status(200).json({ message: "Email verification token sent successfully" });
  }

  const token = user.emailVerificationToken[0];

  if (token.createdAt.getTime() + EXPIRATION_TIME < Date.now()) {
    await deleteEmailVerificationToken(token.token);
    await sendEmailVerificationToken(user.email);
    return res.status(200).json({ message: "Email verification token sent successfully" });
  } 
  
  if (token.resendCount >= TOKEN_RESEND_INTERVALS.length) {
    return res.status(400).json({ message: "Maximum resend count exceeded" });
  }

  const interval = TOKEN_RESEND_INTERVALS[token.resendCount];
  const nextAllowedResendTime = token.lastSent.getTime() + interval;
  if (Date.now() < nextAllowedResendTime) {
    return res.status(400).json({ message: "You must wait before requesting another verification email.", next: new Date(nextAllowedResendTime) });
  }
  
  await updateEmailVerificationToken(token.token, {
    lastSent: new Date(),
    resendCount: {
      increment: 1,
    },
  });

  await sendEmailVerificationToken(user.email, token.token);
  return res.status(200).json({ message: "Email verification token resent successfully" });
}