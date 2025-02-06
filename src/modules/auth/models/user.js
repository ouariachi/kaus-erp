import { prisma } from "#src/db";

export async function getUserByEmail(email, include) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include,
  });
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function createUser(user) {
  return await prisma.user.create({
    data: user,
  });
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
}