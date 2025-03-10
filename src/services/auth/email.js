import { sendEmail } from "#src/email";
import { getTemplate } from "#src/templates/getTemplate";
import { createEmailVerificationToken } from "#src/models/EmailVerificationToken";
import { generateEmailVerificationToken } from "#src/utils/auth/emailVerificationToken";

export async function sendEmailVerificationToken(email, name, token = undefined) {
  if (!token) {
    token = generateEmailVerificationToken();
    const result = await createEmailVerificationToken(email, token);

    if (!result) {
      throw new Error("Failed to create email verification token");
    }
  }

  const template = getTemplate("email/verificationToken", {
    name,
    link: `${process.env.SERVER_URL}/auth/email-verification?token=${token}&email=${email}`,
  });

  return await sendEmail({
    to: email,
    subject: "ERP Email Verification",
    html: template,
  });
}
