export function isFunction(query) {
  return typeof query === 'function';
}

// export function isValue(query) {
//   return query !== undefined && query !== null && query !== '';
// }

export function isValue(query) {
  if (!query) return false;
  if (query === undefined) return false;
  if (query === null) return false;
  if (query === '') return false;
  if (Array.isArray(query) && query?.length === 0) return false;
  return true;
}
