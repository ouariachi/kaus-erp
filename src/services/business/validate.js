import { getBusinessWhere } from "#src/models/Business";

export async function businessExists(data, excludeID) {
  const business = await getBusinessWhere(
    {
      OR: [
        { id: data.id },
        { name: { contains: data.name, mode: "insensitive" } },
        { nif: { contains: data.nif, mode: "insensitive" } },
        { phone: { contains: data.phone, mode: "insensitive" } },
        { email: { contains: data.email, mode: "insensitive" } },
      ],
      ...(excludeID ? { NOT: { id: excludeID } } : {}),
    },
    {
      BusinessUsers: false,
    },
  );

  return !!business;
}

export async function getBusinessByAllowedDomains(...domains) {
  const normalizedDomains = domains.flat().map((d) => d.toLowerCase());
  return await getBusinessWhere({
    emailDomains: {
      hasSome: normalizedDomains,
    },
  });
}

export async function getBusinessByAllowedEmails(...emails) {
  return await getBusinessWhere({
    allowedEmails: {
      hasSome: emails.flat(),
    },
  });
}
