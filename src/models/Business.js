import { prisma } from "#src/db";
import { Prisma } from "@prisma/client";

/** @type {Prisma.BusinessInclude} */
const DEFAULT_INCLUDE = {
  BusinessUsers: {
    include: {
      User: true,
      Modules: true
    }
  }
};

/**
 * @param {Prisma.BusinessCreateInput} business
 * @param {Prisma.BusinessInclude | undefined} include 
 */
export async function createBusiness(business, include) {
  return await prisma.business.create({
    data: business,
    include: include || DEFAULT_INCLUDE
  });
}

/**
 * @param {number} id
 * @param {Prisma.BusinessInclude | undefined} include 
 */
export async function getBusinessById(id, include) {
  return await prisma.business.findUnique({
    where: {
      id,
    },
    include: include || DEFAULT_INCLUDE
  });
}

/**
 * @param {Prisma.BusinessWhereInput} where
 * @param {Prisma.BusinessInclude | undefined} include 
 */
export async function getBusinessWhere(where, include) {
  return await prisma.business.findFirst({
    where,
    include: include || DEFAULT_INCLUDE
  });
}

/**
 * @param {Object} data
 * @param {Prisma.BusinessWhereInput} [data.where]
 * @param {Prisma.BusinessInclude | undefined} data.include
 * @param {Prisma.BusinessOrderByWithRelationInput | undefined} data.orderBy
 * @param {number} [data.page=1]
 * @param {number} [data.limit=10]
 */
export async function getBusinesses({ where, include, orderBy, page = 1, limit = 10 }) {
  limit = Math.max(limit, 1);
  const total = await prisma.business.count();
  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, totalPages);

  if (total === 0) {
    return {
      business: [],
      pagination: {
        total,
        limit,
        page,
        totalPages,
        nextPage: null,
        prevPage: null,
      }
    }
  }

  const business = await prisma.business.findMany({
    where,
    include: include || DEFAULT_INCLUDE,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: orderBy || { createdAt: "desc" },
  });

  return {
    business,
    pagination: {
      total,
      limit,
      page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    }
  }
}

/**
 * @param {number} id
 * @param {Prisma.BusinessUpdateInput} data
 * @param {Prisma.BusinessInclude | undefined} include 
 */
export async function updateBusiness(id, data, include) {
  return await prisma.business.update({
    where: {
      id,
    },
    data,
    include: include || DEFAULT_INCLUDE
  });
}

/**
 * @param {number} id
 */
export async function deleteBusiness(id) {
  return await prisma.business.delete({
    where: {
      id,
    },
  });
}