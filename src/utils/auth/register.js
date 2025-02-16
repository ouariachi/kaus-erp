/**
 * Sends a 403 Forbidden response indicating that the email is not allowed for registration.
 * 
 * ⚠️ Security Note:
 * The message is the same whether:
 * 1. The email is already registered in the system.
 * 2. The email domain or address is not allowed for registration.
 * 
 * This prevents user enumeration attacks by not revealing whether the email exists or if its domain is blocked.
 * @param {import("express").Response} res - The Express Response object.
 */
export function emailRegistrationNotAllowed(res) {
  return res.status(403).json({ message: "This email can not be registered" });
}