/**
 * Sends a 400 Bad Request response indicating that the email is not valid.
 *
 * ⚠️ Security Note:
 * The message is the same whether:
 * 1. The email is already registered in the system.
 * 2. The email domain or address is not allowed for registration.
 *
 * This prevents user enumeration attacks by not revealing whether the email exists or if its domain is blocked.
 * @param {import("express").Response} res - The Express Response object.
 */
export function respondWithEmailRegistrationFailure(res) {
  return res.status(400).json({ message: "This email can not be registered" });
}
