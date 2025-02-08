export function getZodErrors(error) {
  const errors = [];
  for (const issue of error.issues) {
    errors.push({
      path: issue.path,
      message: issue.message,
    });
  }
  return errors;
}
