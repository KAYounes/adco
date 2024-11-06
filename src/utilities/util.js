import { isFunction, isValue } from './checks.js';

export function foo() {
  console.log('\n foo \n');
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
// internals
// internals
// internals

function getValue(query) {
  if (isFunction(query)) {
    return query();
  }

  return query;
}
