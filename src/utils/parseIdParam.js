/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export function parseIdParam(req, res, paramName = "id") {
  const idStr = req.params[paramName];
  if (!idStr) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  const id = parseInt(idStr);
  if (isNaN(idStr) || isNaN(id) || id < 0) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  return id;
}
