import { prisma } from "#src/db";

const DEFAULT_INCLUDE = {
  Businesses: true,
};

/**
 * @param {string} email
 * @param {import("@prisma/client").Prisma.UserInclude} [include]
 */
export async function getUserByEmail(email, include) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include: include || DEFAULT_INCLUDE,
  });
}

/**
 * @param {number} id
 * @param {import("@prisma/client").Prisma.UserInclude} [include]
 */
export async function getUserById(id, include) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: include || DEFAULT_INCLUDE,
  });
}

/**
 * @param {import("@prisma/client").Prisma.UserCreateInput} where
 * @param {import("@prisma/client").Prisma.UserInclude} [include]
 */
export async function createUser(user, include) {
  return await prisma.user.create({
    data: user,
    include: include || DEFAULT_INCLUDE,
  });
}

/**
 * @param {number} id
 * @param {import("@prisma/client").Prisma.UserUpdateInput} data
 * @param {import("@prisma/client").Prisma.UserInclude} [include]
 */
export async function updateUser(id, data, include) {
  return await prisma.user.update({
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
export async function deleteUser(id) {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
}
