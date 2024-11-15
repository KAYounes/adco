import { isEmpty } from "#utilities/util.js";

export function isValidAnswer(input, required, validate) {
  if (isEmpty(input)) {
    if (required) {
      return [false, "This cannot be left empty!"];
    }
  }

  const validity = validate(input);

  if (validity === true) {
    return [true, ""];
  }

  // If validity is a string, use it as the error message
  return [
    false,
    typeof validity === "string" ? validity : "Your answer was not valid!",
  ];
}

export function resolveAnswer(input, defaultInUse, defaultValue) {
  if (isEmpty(input)) {
    if (defaultInUse) return defaultValue;
  }

  return input;
}

export function resolveUseDefault(defaultValue, check) {
  if (defaultValue) {
    return check;
  }
  return false;
}
