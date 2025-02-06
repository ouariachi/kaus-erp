import { getUserById, updateUser } from "../models/user.js";
import { verifyPassword } from "../utils/password.js";
import { generate2FASecret, verify2FASecret } from "../utils/2FA.js";
import speakeasy from "speakeasy";

/** @type {import('express').RequestHandler} */
export async function enable2FA(req, res) {
  const userid = req.session.user.id;
  const user = await getUserById(userid);
  if (!user) {
    req.session.destroy();
    return res.status(404).json({ message: "User not found" });
  }

  const password = req.validatedData.password;
  if(!await verifyPassword(password, user.password)) {
    return res.status(401).json({ message: "Invalid password" });
  }
  
  let twoFASecret = {};
  if (!user.twoFASecret) {
    twoFASecret = generate2FASecret(user.email);
    console.log(twoFASecret)
    try {
      await updateUser(userid, { twoFASecret: twoFASecret.base32 });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    twoFASecret.base32 = user.twoFASecret;
    twoFASecret.otpauth_url = speakeasy.otpauthURL({
      secret: twoFASecret.base32,
      label: user.email, 
      issuer: "KAUS ERP", 
    });
  }

  return res.status(200).json({ 
    secret: {
      code: twoFASecret.base32,
      url: twoFASecret.otpauth_url
    }  
  });
}

/** @type {import('express').RequestHandler} */
export async function confirm2FA(req, res) {
  const userid = req.session.user.id;
  const user = await getUserById(userid);
  if (!user) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const password = req.validatedData.password;
  if(!await verifyPassword(password, user.password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  if (!user.twoFASecret) {
    return res.status(400).json({ message: "2FA is already disabled" });
  }

  const code = req.validatedData.code;
  if (!verify2FASecret(user.twoFASecret, code)) {
    return res.status(401).json({ message: "Invalid code" });
  }

  const is2FAEnabled = user.twoFAEnabled;
  if (is2FAEnabled) {
    return res.status(200).json({ message: "2FA is already enabled" });
  }

  try {
    await updateUser(userid, { twoFAEnabled: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(200).json({ message: "2FA enabled successfully" });
}

/** @type {import('express').RequestHandler} */
export async function disable2FA(req, res) {
  const userid = req.session.user.id;
  const user = await getUserById(userid);
  if (!user) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const password = req.validatedData.password;
  if(!await verifyPassword(password, user.password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const secret = user.twoFASecret;
  const is2FAEnabled = user.twoFAEnabled;
  if (!secret || !is2FAEnabled) {
    return res.status(400).json({ message: "2FA is already disabled" });
  }

  const code = req.validatedData.code;
  if (!verify2FASecret(secret, code)) {
    return res.status(401).json({ message: "Invalid code" });
  }

  try {
    await updateUser(userid, { twoFAEnabled: false, twoFASecret: null });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(200).json({ message: "2FA disabled successfully" });
}

