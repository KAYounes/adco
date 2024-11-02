export function getRawLength(str) {
  // Remove ANSI escape codes
  const ansiRegex = /\u001B\[[0-9;]*m/g;
  return str.replace(ansiRegex, '').length;
}

export function getRawString(str) {
  // Remove ANSI escape codes
  const ansiRegex = /\u001B\[[0-9;]*m/g;
  return str.replace(ansiRegex, '');
}
