import { getBusinesses } from "#src/models/Business";
import { validatePagination } from "#src/utils/pagination";

/** @type {import("express").RequestHandler} */
export async function list(req, res) {
  let { limit: noValidatedLimit, page: noValidatedPage } = req.query;
  const { page, limit, success } = validatePagination({ page: noValidatedPage, limit: noValidatedLimit, res });
  if (!success) return;

  try {
    const result = await getBusinesses({
      page,
      limit,
      include: {
        BusinessUsers: false
      }
    });
  
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}