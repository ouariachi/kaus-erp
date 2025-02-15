import { prisma } from "#src/db";

export async function createEmailVerificationToken(email, token) {
  return await prisma.emailVerificationToken.create({
    data: {
      token,
      User: {
        connect: {
          email,
        },
      },
    },
    include: {
      User: true,
    },
  });
}

export async function getEmailVerificationToken(token) {
  return await prisma.emailVerificationToken.findUnique({
    where: {
      token,
    },
    include: {
      User: true,
    },
  });
}

export async function updateEmailVerificationToken(token, data) {
  return await prisma.emailVerificationToken.update({
    where: {
      token,
    },
    data,
    include: {
      User: true,
    },
  });
}

export async function deleteEmailVerificationToken(token) {
  return await prisma.emailVerificationToken.delete({
    where: {
      token,
    },
    include: {
      User: true,
    },
  });
}
