/**
 * @param {import("zod").z.ZodObject<any>} schemaA
 * @param {import("zod").z.ZodObject<any>} schemaB
 * @returns {string[]}
 */
export function getSchemaFieldDifference(schemaA, schemaB) {
  const fieldsA = Object.keys(schemaA.shape);
  const fieldsB = Object.keys(schemaB.shape);
  return fieldsA.filter((field) => !fieldsB.includes(field));
}
