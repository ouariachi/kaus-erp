import { sendEmail } from "#src/email";
import { getTemplate } from "#src/templates/getTemplate";
import { createEmailVerificationToken } from "../models/emailVerificationToken.js";
import { generateEmailVerificationToken } from "../utils/emailVerificationToken.js";

export async function sendEmailVerificationToken(email, token = undefined) {
  if (!token) {
    token = generateEmailVerificationToken();
    const result = await createEmailVerificationToken(email, token);
    
    if (!result) {
      throw new Error("Failed to create email verification token");
    }
  }

  const template = getTemplate("email/verificationToken", {
    name: "Admin",
    link: `${process.env.SERVER_URL}/auth/email-verification?token=${token}&email=${email}`,
  })

  await sendEmail({
    to: email,
    subject: "ERP Email Verification",
    html: template,
  });
}