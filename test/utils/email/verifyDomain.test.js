import { verifyDomain } from "#src/utils/email/verifyDomain";
import { expect, test } from "vitest";

test("Verify Domain", async () => {
  const valid = await verifyDomain("gmail.com");
  expect(valid).toBe(true);
});

test("Verify Domain - Invalid domain", async () => {
  const valid = await verifyDomain("domain.invalid");
  expect(valid).toBe(false);
});