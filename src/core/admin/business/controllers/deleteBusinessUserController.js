import { deleteBusinessUser } from "#src/models/BusinessUser";

/** @type {import("express").RequestHandler} */
export async function deleteBusinessUserController(req, res) {
  try {
    const deletedBusinessUser = await deleteBusinessUser(req.userId);
    if (!deletedBusinessUser) {
      return res.status(500).json({ message: "Error deleting business user" });
    }
  } catch (error) {
    return res.status(500).json({  message: "Error deleting business user", error: error.message });
  }

  return res.status(200).json({ message: "Business user deleted successfully" });
}