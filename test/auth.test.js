import { prisma } from "#src/db";
import { expect, test } from "vitest";

const SERVER_URL = process.env.SERVER_URL

const data = {
  firstname: "Vitest",
  lastname: "Test User",
  email: "vitest@erp.local",
  password: "vitest1234",
}

await (async () => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });
  if(!user) return;
  await prisma.user.update({
    where: {
      email: data.email
    },
    data: {
      EmailVerificationToken: {
        deleteMany: {}
      },
    }
  });
  await prisma.user.delete({
    where: {
      email: data.email
    }
  });
})();

test("Register", async () => {
  const res = await fetch(SERVER_URL + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  expect(res.status).toBe(201);
});

test("Email Verification", async () => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    },
    include: {
      EmailVerificationToken: true
    }
  });

  const query = new URLSearchParams({ 
    token: user.EmailVerificationToken[0].token,
    email: data.email
  });
  const url = SERVER_URL + "/auth/email-verification?" + query.toString();
  const res = await fetch(url  , {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  expect(res.status).toBe(200);
});

test("Login", async () => {
  const res = await fetch(SERVER_URL + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  expect(res.status).toBe(200);
  expect(res.headers.get("set-cookie")).not.toBe(null);
});