/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export function parseIdParam(req, res) {
  const { id: idStr } = req.params;
  if (!idStr) {
    res.status(400).json({ message: 'Invalid request' });
    return 
  }
  
  const id = parseInt(idStr);
  if (isNaN(idStr) || isNaN(id) || id < 0) {
    res.status(400).json({ message: 'Invalid id' });
    return 
  }

  return id;
}