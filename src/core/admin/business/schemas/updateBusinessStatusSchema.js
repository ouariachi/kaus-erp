import { BusinessSatus } from "@prisma/client";
import { z } from "zod";

export const updateBusinessStatusSchema = z.object({
  status: z
    .nativeEnum(BusinessSatus, {
      required_error: "Status is required",
      invalid_type_error: "Invalid status",
    })
});
