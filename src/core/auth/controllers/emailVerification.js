import { deleteEmailVerificationToken, getEmailVerificationToken, updateEmailVerificationToken } from "#src/models/EmailVerificationToken";
import { getUserByEmail, updateUser } from "#src/models/User";
import { sendEmailVerificationToken } from "#src/services/auth/email";

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

  if (emailVerificationToken.User.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  if (emailVerificationToken.User.email !== email) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (emailVerificationToken.createdAt.getTime() + EXPIRATION_TIME < Date.now()) {
    return res.status(400).json({ message: "Token expired" });
  }

  await updateUser(emailVerificationToken.User.id, {
    emailVerified: true,
  });

  await deleteEmailVerificationToken(token);

  return res.status(200).json({ message: "Email verified successfully" });
}

const TOKEN_RESEND_INTERVALS = [0.5 * HOUR, 1 * HOUR, 5 * HOUR, 12 * HOUR];

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
    await sendEmailVerificationToken(user.email, user.firstname);
    return res.status(200).json({ message: "Email verification token sent successfully" });
  }

  const token = user.emailVerificationToken[0];

  if (token.createdAt.getTime() + EXPIRATION_TIME < Date.now()) {
    await deleteEmailVerificationToken(token.token);
    await sendEmailVerificationToken(user.email, user.firstname);
    return res.status(200).json({ message: "Email verification token sent successfully" });
  }

  if (token.resendCount >= TOKEN_RESEND_INTERVALS.length) {
    return res.status(400).json({ message: "Maximum resend count exceeded" });
  }

  const interval = TOKEN_RESEND_INTERVALS[token.resendCount];
  const nextAllowedResendTime = token.lastSent.getTime() + interval;
  if (Date.now() < nextAllowedResendTime) {
    return res.status(400).json({
      message: "You must wait before requesting another verification email.",
      next: new Date(nextAllowedResendTime),
    });
  }

  await updateEmailVerificationToken(token.token, {
    lastSent: new Date(),
    resendCount: {
      increment: 1,
    },
  });

  await sendEmailVerificationToken(user.email, user.firstname, token.token);
  return res.status(200).json({ message: "Email verification token resent successfully" });
}
