export function parseStringArrays(input) {
  if (typeof input === "string") {
    return input.split(",");
  }
  return input;
}
