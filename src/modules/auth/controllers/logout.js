export async function logout(req, res) {
  req.session.destroy();
  return res.status(200).json({ message: "Logged out successfully" });
}