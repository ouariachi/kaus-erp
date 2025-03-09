import { getBusinessUsers } from "#src/models/BusinessUser";
import { businessExists } from "#src/services/business/validate";
import { validatePagination } from "#src/utils/pagination";
import { parseIdParam } from "#src/utils/parseIdParam";

export async function listUsers(req, res) {
  const id = parseIdParam(req, res);
  if (!id) {
    return;
  }

  let { limit: noValidatedLimit, page: noValidatedPage } = req.query;
  const { page, limit, success } = validatePagination({ page: noValidatedPage, limit: noValidatedLimit, res });
  if (!success) return;

  if (!await businessExists({ id })) {
    return res.status(400).json({ message: 'Business does not exist' });
  }

  try {
    const result = await getBusinessUsers({ 
      where: { Business: { id } },
      page,
      limit, 
      include: {
        User: false,
        Business: false,
        Modules: true
      }
    });
    return res.status(200).json(result);
  } catch  (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}