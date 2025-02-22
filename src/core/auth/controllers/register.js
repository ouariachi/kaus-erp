import { createUser, getUserByEmail } from "#src/models/user";
import { sendEmailVerificationToken } from "#src/services/auth/email";
import { hashPassword } from "#src/utils/auth/password";
import { respondWithEmailRegistrationFailure } from "#src/utils/auth/register";

export async function register(req, res) {
  const { email, password, firstname, lastname } = req.validatedData;
  
  if(await getUserByEmail(email)) {
    return respondWithEmailRegistrationFailure(res);
  }
  
  try {
    const user = await createUser({
      email,
      password: await hashPassword(password),
      firstname,
      lastname,
    });
    await sendEmailVerificationToken(user.email, user.firstname);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(201).json({ message: "User created successfully" });
}