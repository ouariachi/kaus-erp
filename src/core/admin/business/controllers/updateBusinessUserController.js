import { updateBusinessUser } from "#src/models/BusinessUser";

/** @type {import("express").RequestHandler} */
export async function updateBusinessUserController(req, res) {
  try {
    const updatedBusinessUser = await updateBusinessUser(req.userId, req.validatedData);
    if (!updatedBusinessUser) {
      return res.status(500).json({ message: "Error updating business user" });
    }
  } catch (error) {
    return res.status(500).json({  message: "Error updating business user", error: error.message });
  }

  return res.status(200).json({ message: "Business user updated successfully" });
}