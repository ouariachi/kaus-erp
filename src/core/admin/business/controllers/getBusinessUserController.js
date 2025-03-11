import { getBusinessUserById } from "#src/models/BusinessUser";
import { parseIdParam } from "#src/utils/parseIdParam";

/** @type {import("express").RequestHandler} */
export async function getBusinessUserController(req, res) {
  const id = parseIdParam(req, res, "userId");
  if (!id) {
    return;
  }

  try {
    const result = await getBusinessUserById(id, { Business: false });
    if (!result) {
      return res.status(404).json({ message: "Business user not found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
