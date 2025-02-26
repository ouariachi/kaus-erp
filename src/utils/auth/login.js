/**
 * Sends a 401 Unauthorized response indicating that the email is not valid.
 * 
 * ⚠️ Security Note:
 * The message is the same whether:
 * 1. The email does not exist in the system.
 * 2. The password is incorrect.
 * 
 * This prevents user enumeration attacks by not revealing whether the email exists in the system.
 * @param {import("express").Response} res - The Express Response object.
 * @param {number} [remainingAttempts=4] - The number of remaining login attempts before the account is locked.
 */
export function respondWithEmailLoginFailure (res, remainingAttempts = 4) {
  return res.status(401).json({ message: "Invalid email or password", remainingAttempts });
}