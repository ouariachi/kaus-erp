import { PrismaClient } from "@prisma/client";

/** @type {import('@prisma/client').PrismaClient} */
export let prisma; // singleton

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
