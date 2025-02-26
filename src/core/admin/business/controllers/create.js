import { prisma } from "#src/db";
import { isSuperAdmin } from "#src/utils/auth/userRole";

/** @type {import("express").RequestHandler} */
export async function create(req, res) {
  if(!isSuperAdmin(req.session.user)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const newBusiness = await prisma.business.create({
      data: req.validatedData
    });
    
    if (!newBusiness) {
      return res.status(500).json({ message: 'Error creating business' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating business' });
  }

  res.status(201).json({ message: 'Business created' });
}