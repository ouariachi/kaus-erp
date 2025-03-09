import { getBusinessById } from "#src/models/Business";

/** @type {import("express").RequestHandler} */
export async function getById(req, res) {
  const { id: idStr } = req.params;
  if (!idStr) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  
  const id = parseInt(idStr);
  if (isNaN(idStr) || isNaN(id) || id < 0) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const result = await getBusinessById(id);
    if (!result) {
      return res.status(404).json({ message: 'Business not found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}