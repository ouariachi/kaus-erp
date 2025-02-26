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