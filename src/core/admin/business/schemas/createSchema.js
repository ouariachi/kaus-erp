import { z } from "zod";

export const createSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim(),

  nif: z
    .string({
      required_error: "NIF is required",
      invalid_type_error: "NIF must be a string",
    })
    .trim(),

  phone: z
    .string({
      required_error: "Phone is required",
      invalid_type_error: "Phone must be a string",
    })
    .trim(),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email("Invalid email format"),

  emailDomains: z
    .array(
      z
        .string({
          invalid_type_error: "Domain must be a string",
        })
        .trim()
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
    )
    .min(1, "At least one domain is required"),

  allowedEmails: z
    .array(
      z
        .string({
          invalid_type_error: "Each exception email must be a string",
        })
        .trim()
        .email("Invalid exception email format")
    )
    .optional(),

  address: z
    .string({
      invalid_type_error: "Address must be a string",
    })
    .trim()
    .optional(),
  
  city: z
    .string({
      invalid_type_error: "City must be a string",
    })
    .trim()
    .optional(),

  state: z
    .string({
      invalid_type_error: "State must be a string",
    })
    .trim()
    .optional(),
  
  zipCode: z
    .string({
      invalid_type_error: "ZIP code must be a string",
    })
    .trim()
    .optional(),

  country: z
    .string({
      invalid_type_error: "Country must be a string",
    })
    .trim()
    .optional(),  

  industry: z
    .string({
      invalid_type_error: "Industry must be a string",
    })
    .trim()
    .optional(),

  website: z
    .string({
      invalid_type_error: "Website must be a string",
    })
    .trim()
    .url("Invalid website URL format")
    .optional(),

  logo: z
    .string({
      invalid_type_error: "Logo must be a string",
    })
    .trim()
    .url("Invalid logo URL format")
    .optional(),
});
