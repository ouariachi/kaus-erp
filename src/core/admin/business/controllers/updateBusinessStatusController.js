import { updateBusiness } from "#src/models/Business";

/** @type {import("express").RequestHandler} */
export async function updateBusinessStatusController(req, res) {
  try {
    const updatedBusiness = await updateBusiness(req.businessId, {
      status: req.businessStatus,
    });
    if (!updatedBusiness) {
      return res.status(500).json({ message: "Error updating business status" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating business status", error: error.message });
  }
  
  res.status(200).json({ message: "Business status updated" });
}
