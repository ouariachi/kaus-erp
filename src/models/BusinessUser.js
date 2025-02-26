import { prisma } from "#src/db";
import { Prisma } from "@prisma/client";

/** @type {Prisma.BusinessUserInclude} */
const DEFAULT_INCLUDE = {
  User: true,
  Business: true,
  Modules: true  
};

/**
 * @param {Prisma.BusinessUserCreateInput} businessUser
 * @param {Prisma.BusinessUserInclude | undefined} include
 */
export async function createBusinessUser(businessUser, include) {
  return await prisma.businessUser.create({
    data: businessUser,
    include: include || DEFAULT_INCLUDE
  });
}

/**
 * @param {number} id
 * @param {Prisma.BusinessUserInclude | undefined} include
 */
export async function getBusinessUserById(id, include) {
  return await prisma.businessUser.findUnique({
    where: {
      id,
    },
    include: include || DEFAULT_INCLUDE
  });
}

/**
 * @param {number} userId
 * @param {Prisma.BusinessUserInclude | undefined} include
 */
export async function getBusinessUserByUserId(userId, include) { 
  return await prisma.businessUser.findFirst({
    where: {
      User: {
        id: userId
      }
    },
    include: include || DEFAULT_INCLUDE
  });
}

/**
 * @param {number} businessId
 * @param {Prisma.BusinessUserInclude | undefined} include
 */
export async function updateBusinessUser(id, data, include) {
  return await prisma.businessUser.update({
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
export async function deleteBusinessUser(id) {
  return await prisma.businessUser.delete({
    where: {
      id,
    },
  });
}