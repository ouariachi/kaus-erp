import { prisma } from "#src/db";

export async function createEmailVerificationToken(email, token) {
  return await prisma.emailVerificationToken.create({
    data: {
      token,
      user: {
        connect: {
          email,
        },
      },
    },
    include: {
      user: true,
    },
  });
}

export async function getEmailVerificationToken(token) {
  return await prisma.emailVerificationToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
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
      user: true,
    },
  });
}

export async function deleteEmailVerificationToken(token) {
  return await prisma.emailVerificationToken.delete({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
}
