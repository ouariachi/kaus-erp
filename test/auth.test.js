import { getApp } from "#src/http";
import { afterAll, beforeAll, describe, it } from "vitest";
import request from "supertest";
import { prisma } from "#src/db";

const app = getApp();

describe("Auth Tests", () => {
  let server;
  let cookie;
  const AUTH_DATA = {
    email: "no-reply@ouariachi.com",
    password: "test1234",
    firstname: "Test",
    lastname: "User",
  };

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll(async () => {
    server.close();
    await prisma.$transaction([
      prisma.emailVerificationToken.deleteMany({
        where: { User: { email: AUTH_DATA.email } },
      }),
      prisma.user.deleteMany({ where: { email: AUTH_DATA.email } }),
    ]);
  });

  it("Should register a new user", async () => {
    const res = await request(app).post("/auth/register").send(AUTH_DATA);
    expect(res.status).toBe(201);
  });

  it("Should not register a user with the same email", async () => {
    const res = await request(app).post("/auth/register").send(AUTH_DATA);
    expect(res.status).toBe(400);

    await prisma.user.update({
      where: { email: AUTH_DATA.email },
      data: { emailVerified: true },
    });
  });

  it("Should login the user", async () => {
    const res = await request(app).post("/auth/login").send(AUTH_DATA);
    expect(res.status).toBe(200);
    cookie = res.headers["set-cookie"];
  });

  it("Should not login the user with wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ ...AUTH_DATA, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("Should logout the user", async () => {
    const res = await request(app).post("/auth/logout").set("Cookie", cookie);
    expect(res.status).toBe(200);
  });
});
