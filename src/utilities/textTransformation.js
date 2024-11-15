import chalk from "chalk";

export function toFunctionName(tokens) {
  tokens = tokens.split(" ");
  tokens = tokens.map((token) =>
    token.trim().replace(/^./, (match) => match.toUpperCase())
  );
  tokens = tokens.filter((token) => token);
  return tokens.join("");
}

function upperCapFirst(word) {
  return word.replace(/^./, (first) => first.toUpperCase());
}
function lowerCapFirst(word) {
  return word.replace(/^./, (first) => first.toLowerCase());
}

function tokenize(input) {
  return input.split(" ").filter(Boolean);
}

export function toUpperCamelCase(input) {
  const tokens = tokenize(input);
  return tokens.map((token) => upperCapFirst(token)).join("");
}

export function toLowerCamelCase(input) {
  const upperCamelCase = toUpperCamelCase(input);
  return lowerCapFirst(upperCamelCase);
}
