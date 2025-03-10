import { createBusinessUser } from "#src/models/BusinessUser";
import { BusinessUserStatus } from "@prisma/client";

/** @type {import("express").RequestHandler} */
export async function addUser(req, res) {
  const { email, role } = req.validatedData;
  const businessId = req.businessId;

  try {
    const businessUser = await createBusinessUser({
      role,
      status: BusinessUserStatus.ACTIVE,
      Business: {
        connect: {
          id: businessId,
        },
      },
      User: {
        connect: {
          email,
        },
      },
    });

    if (!businessUser) {
      return res.status(500).json({ message: "Error adding user to business" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error adding user to business", error: error.message });
  }

  res.status(201).json({ message: "User added to business" });
}
