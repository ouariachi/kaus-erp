import { deleteBusiness } from "#src/models/Business";

export async function deleteBusinessController(req, res) {
  try {
    const deletedBusiness = await deleteBusiness(req.businessId);
    if (!deletedBusiness) {
      return res.status(500).json({ message: "Error deleting business" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting business", error: error.message });
  }

  res.status(200).json({ message: "Business deleted successfully" });
}