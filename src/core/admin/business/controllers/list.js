import { getBusinesses } from "#src/models/Business";

/** @type {import("express").RequestHandler} */
export async function list(req, res) {
  let { page } = req.params;
  let { limit } = req.query;
  
  if (page) {
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    page = parseInt(page);
  }

  if (limit) {
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ message: 'Invalid limit' });
    }
    limit = parseInt(limit);
  }
  
  try {
    const result = await getBusinesses({
      page,
      limit,
    });
  
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}