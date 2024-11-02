export function isFunction(query) {
  return typeof query === 'function';
}

export function isValue(query) {
  return query !== undefined && query !== null && query !== '';
}
