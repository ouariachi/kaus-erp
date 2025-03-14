import { createBusiness } from "#src/models/Business";

/** @type {import("express").RequestHandler} */
export async function createBusinessController(req, res) {
  try {
    const newBusiness = await createBusiness(req.validatedData);
    if (!newBusiness) {
      return res.status(500).json({ message: "Error creating business" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error creating business", error: error.message });
  }

  res.status(201).json({ message: "Business created" });
}
