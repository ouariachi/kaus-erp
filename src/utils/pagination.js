/**
 * @param {Object} data
 * @param {number | undefined} data.page
 * @param {number | undefined} data.limit
 * @param {import("express").Response} data.res
 * @returns
 */
export function validatePagination({ page, limit, res }) {
  if (page) {
    if (isNaN(page) || page < 1) {
      res.status(400).json({ message: "Invalid page number" });
      return { success: false };
    }
    page = parseInt(page);
  }

  if (limit) {
    if (isNaN(limit) || limit < 1) {
      res.status(400).json({ message: "Invalid limit" });
      return { success: false };
    }
    limit = parseInt(limit);
  }

  return { page, limit, success: true };
}
