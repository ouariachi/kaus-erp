import { getBusinessById } from "#src/models/Business";
import { parseIdParam } from "#src/utils/parseIdParam";

/** @type {import("express").RequestHandler} */
export async function getBusiness(req, res) {
  const id = parseIdParam(req, res);
  if (!id) {
    return;
  }

  try {
    const result = await getBusinessById(id, { BusinessUsers: false });
    if (!result) {
      return res.status(404).json({ message: 'Business not found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}