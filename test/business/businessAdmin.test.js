import { prisma } from "#src/db";
import { expect, test } from "vitest";

const SERVER_URL = process.env.SERVER_URL

const loginData = {
  email: "admin@erp.local",
  password: "adminerp"
}

const SESSION_COOKIE = await (async () => {
  const result = await fetch(SERVER_URL + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData)
  });

  if (result.status !== 200) {
    throw new Error("Login failed");
  }

  return result.headers.get("set-cookie");
})();

const data = {
  name: "Vitest Business",
  email: "vitest.business@erp.local",
  phone: "123456789",
  nif: "123456789A",
  emailDomains: "vitestbusiness.local"
}
await (async () => {
  const business = await prisma.business.findMany({
    where: {
      OR: [
        { nif: data.nif },
        { email: data.email }
      ]
    }
  });
  if(!business || business.length <= 0) return;
  await prisma.business.deleteMany({
    where: {
      OR: [
        { nif: data.nif },
        { email: data.email }
      ]
    }
  });
})();


test("Create Business", async () => {
  const res = await fetch(SERVER_URL + "/admin/business/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": SESSION_COOKIE
    },
    body: JSON.stringify(data)
  });

  expect(res.status).toBe(201);
});

test("Create Business - Business already exists", async () => {
  const res = await fetch(SERVER_URL + "/admin/business/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": SESSION_COOKIE
    },
    body: JSON.stringify(data)
  });

  expect(res.status).toBe(400);
});
