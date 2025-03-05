import { getBusinesses } from "#src/models/Business";
import { validatePagination } from "#src/utils/pagination";

/** @type {import("express").RequestHandler} */
export async function list(req, res) {
  let { page: noValidatedPage } = req.params;
  let { limit: noValidatedLimit } = req.query;
  const { page, limit, success } = validatePagination({ page: noValidatedPage, limit: noValidatedLimit, res });
  if (!success) return;

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