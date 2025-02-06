import { createUser, getUserByEmail } from "../models/user.js";
import { sendEmailVerificationToken } from "../services/email.js";
import { hashPassword } from "../utils/password.js";

export async function register(req, res) {
  const { email, password, firstname, lastname } = req.validatedData;
  
  if(await getUserByEmail(email)) {
    return res.status(400).json({ message: "Email already exists" });
  }
  
  try {
    const user = await createUser({
      email,
      password: await hashPassword(password),
      firstname,
      lastname,
    });
    await sendEmailVerificationToken(user.email);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(201).json({ message: "User created successfully" });
}