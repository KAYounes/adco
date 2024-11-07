import { createPrompt, useState, useKeypress, isEnterKey, isBackspaceKey, makeTheme } from '@inquirer/core';
import figures from '@inquirer/figures';
import chalk from 'chalk';
import { usePrefix } from './usePrefix.js';
import { getRawLength } from '#utilities/chalkUtils.js';
import { _if, and, I } from '#utilities/util.js';
import { handleEmptySpaces } from './common.js';

import ansiEscapes from 'ansi-escapes';
const BaseTextInputPrompt = createPrompt((config, done) => {
  const theme = makeTheme(config.theme);

  const [input, setInput] = useState('');
  const [errorMsg, setError] = useState();
  const [status, setStatus] = useState('idle');
  const prefix = usePrefix({ status, theme });
  const { required = false, validate = () => true, filter = I, transformer = I } = config;

  const [defaultInUse, setDefaultInUse] = useState(Boolean(config.default));
  const defaultHintInit = chalk.gray(` {${config.default}}`);
  let [useDefault, setUseDefault] = useState(true);
  const logs = [];

  useKeypress(async (key, rl) => {
    if (isEnterKey(key)) {
      const answer = resolveAnswer(input, defaultInUse, config.default);
      const [valid, error] = isValidAnswer(answer, required, validate);
      // console.log(`valid: ${valid}`);
      if (valid) {
        setInput(answer);
        setStatus('done');

        if (typeof filter === 'function') {
          done(filter(answer));
        } else {
          done(answer);
        }
      } else {
        rl.write(input);
        setError(error);
      }
    } else if (isBackspaceKey(key)) {
      if (!input) {
        if (!required) {
          if (defaultInUse) {
            setDefaultInUse(false);
          }
        } else {
          setError('Default will be used since this answer is required.');
        }
      }

      setInput(rl.line); // read input
      // setError(undefined); // clear errors
    } else {
      setInput(rl.line); // read input
      setError(undefined); // clear errors
    }
  });

  const message = theme.style.message(config.message, status);
  let formattedValue = input;

  if (status === 'done') {
    return chalk.green(`${prefix} ${message} |${formattedValue}|`);
  }

  const defaultHint = _if(defaultInUse, ' ' + defaultHintInit, '');
  return [`${prefix} ${message}${defaultHint} ${formattedValue}`, chalk.red.italic(errorMsg ?? '')];
});

export default BaseTextInputPrompt;

function isValidAnswer(input, required, validate) {
  // console.log(input, required);
  if (!input) {
    if (required) {
      return [false, 'This cannot be left empty!'];
    }
  }

  const validity = validate(input);

  if (validity === true) {
    return [true, ''];
  }

  // If validity is a string, use it as the error message
  return [false, typeof validity === 'string' ? validity : 'Your answer was not valid!'];
}

function resolveAnswer(input, defaultInUse, defaultValue) {
  if (!input) {
    if (defaultInUse) return defaultValue;
  }

  return input;
}
