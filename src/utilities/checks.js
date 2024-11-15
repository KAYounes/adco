export function isFunction(query) {
  return typeof query === "function";
}

// export function isValue(query) {
//   return query !== undefined && query !== null && query !== '';
// }

export function isValue(query) {
  if (!query) return false;
  if (query === undefined) return false;
  if (query === null) return false;
  if (query === "") return false;
  if (Array.isArray(query) && query?.length === 0) return false;
  return true;
}

export function isString(query) {
  return typeof query === "string";
}

export function is_valid_function_name(query) {
  const pattern = new RegExp(/^[a-zA-Z\$_][a-zA-Z\$_0-9]*$/);
  return pattern.test(query);
}
