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

// internals
// internals
// internals

export function getValue(query) {
  if (isFunction(query)) {
    return query();
  }

  return query;
}
