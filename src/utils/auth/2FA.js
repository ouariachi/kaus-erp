import speakeasy from "speakeasy";

export function generate2FASecret(email) {
  return speakeasy.generateSecret({ length: 20, name: `ERP (${email})` });
}

export function verify2FASecret(secret, code) {
  return speakeasy.totp.verify({ secret, encoding: "base32", token: code, window: 1 });
}
