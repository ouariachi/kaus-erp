export async function logoutController(req, res) {
  req.session.destroy();
  return res.status(200).json({ message: "Logged out successfully" });
}
