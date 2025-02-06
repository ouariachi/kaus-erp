import { getUserByEmail, updateUser } from "../models/user.js";
import { verify2FASecret } from "../utils/2FA.js";
import { verifyPassword } from "../utils/password.js";

const LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT = 60 * 60 * 1000; // 1 hour

export async function login(req, res) {
  const { email, password } = req.validatedData;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user.failedLogins >= LOGIN_ATTEMPTS) {
    if (user.lastLogin && Date.now() - user.lastLogin < LOGIN_TIMEOUT) {
      return res.status(429).json({ message: "Too many failed attempts. Please try again later." });
    }
  
    await updateUser(user.id, { failedLogins: 0, lastLogin: null });
    user.failedLogins = 0;
    user.lastLogin = null;
  }

  if (!await verifyPassword(password, user.password)) {
    try {
      const updated = await updateUser(user.id, { 
        failedLogins: {  
          increment: 1 
        },
        lastLogin: new Date()
      });
      
      user.failedLogins = updated.failedLogins;
      user.lastLogin = updated.lastLogin;
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(401).json({ message: "Invalid email or password", remainingAttempts: LOGIN_ATTEMPTS - user.failedLogins });
  }

  if (user.emailVerified === false) {
    return res.status(401).json({ message: "Email not verified" });
  }

  if (user.twoFAEnabled === true) {
    if (!req.validatedData.code) {
      return res.status(401).json({ message: "2FA is enabled, please provide a code" });
    }

    const isValid = verify2FASecret(user.twoFASecret, req.validatedData.code);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid 2FA code" });
    }
  }

  req.session.user = {
    id: user.id,
    role: user.role
  }

  try {
    await updateUser(user.id, { failedLogins: 0, lastLogin: new Date() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(200).json({ message: "Loged in successfully" });
}