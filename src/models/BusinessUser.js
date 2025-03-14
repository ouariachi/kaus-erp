import { prisma } from "#src/db";

/** @type {import("@prisma/client").Prisma.BusinessUserInclude} */
const DEFAULT_INCLUDE = {
  User: true,
  Business: true,
  Modules: true,
};

/**
 * @param {import("@prisma/client").Prisma.BusinessUserCreateInput} businessUser
 * @param {import("@prisma/client").Prisma.BusinessUserInclude | undefined} include
 */
export async function createBusinessUser(businessUser, include) {
  return await prisma.businessUser.create({
    data: businessUser,
    include: include || DEFAULT_INCLUDE,
  });
}

/**
 * @param {number} id
 * @param {import("@prisma/client").Prisma.BusinessUserInclude | undefined} include
 */
export async function getBusinessUserById(id, include) {
  return await prisma.businessUser.findUnique({
    where: {
      id,
    },
    include: include || DEFAULT_INCLUDE,
  });
}

/**
 * @param {number} userId
 * @param {import("@prisma/client").Prisma.BusinessUserInclude | undefined} include
 */
export async function getBusinessUserByUserId(userId, include) {
  return await prisma.businessUser.findFirst({
    where: {
      User: {
        id: userId,
      },
    },
    include: include || DEFAULT_INCLUDE,
  });
}

/**
 * @param {Object} data
 * @param {import("@prisma/client").Prisma.BusinessUserWhereInput} [data.where]
 * @param {import("@prisma/client").Prisma.BusinessUserInclude | undefined} data.include
 * @param {import("@prisma/client").Prisma.BusinessUserOrderByWithRelationInput | undefined} data.orderBy
 * @param {number} [data.page=1]
 * @param {number} [data.limit=10]
 */
export async function getBusinessUsers({ where, include, orderBy, page = 1, limit = 10 }) {
  limit = Math.max(limit, 1);
  const total = await prisma.businessUser.count();
  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, totalPages);

  if (total === 0) {
    return {
      users: [],
      pagination: {
        total,
        limit,
        page,
        totalPages,
        nextPage: null,
        prevPage: null,
      },
    };
  }

  const users = await prisma.businessUser.findMany({
    where,
    include: include || DEFAULT_INCLUDE,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: orderBy || { createdAt: "desc" },
  });

  return {
    users,
    pagination: {
      total,
      limit,
      page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
}

/**
 * @param {number} businessId
 * @param {import("@prisma/client").Prisma.BusinessUserInclude | undefined} include
 */
export async function updateBusinessUser(id, data, include) {
  return await prisma.businessUser.update({
    where: {
      id,
    },
    data,
    include: include || DEFAULT_INCLUDE,
  });
}

/**
 * @param {number} id
 */
export async function deleteBusinessUser(id) {
  return await prisma.businessUser.delete({
    where: {
      id,
    },
  });
}
