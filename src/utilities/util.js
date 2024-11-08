import { isFunction, isValue } from "./checks.js";

export function foo() {
  console.log("\n foo \n");
}

export function _if(query, ifTrue, ifFalse) {
  if (isValue(query)) {
    return getValue(ifTrue);
  }

  return getValue(ifFalse);
}

export function and(...args) {
  return args.every(Boolean);
}

export function I(query) {
  return query;
}

export function isEmpty(query) {
  if (query?.length === undefined)
    throw Error(
      "function isEmpty(query) - logical error: query dose not have length property"
    );

  return !query.length;
}

export function fallback(query, def) {
  return query ?? def;
}

// internals
// internals
// internals

function getValue(query) {
  if (isFunction(query)) {
    return query();
  }

  return query;
}
