import { updateBusiness } from "#src/models/Business";

/** @type {import("express").RequestHandler} */
export async function updateBusinessController(req, res) {
  try {
    const updatedBusiness = await updateBusiness(req.businessId, req.validatedData);
    if (!updatedBusiness) {
      return res.status(500).json({ message: "Error updating business" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating business", error: error.message });
  }
  
  res.status(200).json({ message: "Business updated" });
}
