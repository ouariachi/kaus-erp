import { createUser, deleteUser, getUserByEmail } from "#src/models/User";
import { sendEmailVerificationToken } from "#src/services/auth/email";
import { hashPassword } from "#src/utils/auth/password";
import { respondWithEmailRegistrationFailure } from "#src/utils/auth/register";
import { SMTP_ERROR_MESSAGES } from "#src/utils/email/smtpErrorMessages";

export async function registerController(req, res) {
  const { email, password, firstname, lastname } = req.validatedData;
  if (await getUserByEmail(email)) {
    return respondWithEmailRegistrationFailure(res);
  }

  let user;

  try {
    user = await createUser({
      email,
      password: await hashPassword(password),
      firstname,
      lastname,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }

  try {
    await sendEmailVerificationToken(email, firstname);
  } catch (err) {
    if (user) {
      await deleteUser(user.id);
    }

    if (err.responseCode) {
      const errorMessage = SMTP_ERROR_MESSAGES[err.responseCode];
      if (errorMessage) {
        return res.status(errorMessage.httpCode).json({ message: errorMessage.message });
      }
    }
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }

  return res.status(201).json({ message: "User created successfully" });
}
