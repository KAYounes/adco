import { createPrompt, useState, useKeypress, isEnterKey, isBackspaceKey, makeTheme, useRef } from '@inquirer/core';
import figures from '@inquirer/figures';
import chalk from 'chalk';
import { usePrefix } from './usePrefix.js';
import { getRawLength } from '#utilities/chalkUtils.js';
import { _if, and, I, isEmpty } from '#utilities/util.js';
import { handleEmptySpaces } from './common.js';

import ansiEscapes from 'ansi-escapes';
const BaseTextInputPrompt = createPrompt((config, done) => {
  const theme = makeTheme(config.theme);

  const [input, setInput] = useState('');
  const [errorMsg, setError] = useState();
  const [status, setStatus] = useState('idle');
  const prefix = usePrefix({ status, theme });
  const { required = false, validate = () => true, filter = I, transformer = I } = config;

  const [c, setC] = useState(0);
  const ignoreinput = useRef(false);
  const ignoreTimeout = useRef();

  const [defaultInUse, setDefaultInUse] = useState(Boolean(config.default));
  const defaultHintInit = chalk.gray(
    `Default [${chalk.yellow(config.default)}]: ${chalk.underline('remove (backspace)')} | ${chalk.underline(
      'edit (tab)',
    )}`,
  );
  let [useDefault, setUseDefault] = useState(true);
  const [logs, setLogs] = useState([]);

  useKeypress(async (key, rl) => {
    setError(undefined);
    if (isEnterKey(key)) {
      const answer = resolveAnswer(input, defaultInUse, config.default);
      const [valid, error] = isValidAnswer(answer, required, validate);
      logs.push('1');
      if (valid) {
        setInput(answer);
        setStatus('done');

        if (typeof filter === 'function') {
          done(filter(answer));
        } else {
          done(answer);
        }
      } else {
        logs.push('2');
        rl.write(input);
        setError(error);
      }
    } else {
      logs.push('3');
      const currentInput = rl.line;
      setInput(currentInput);

      if (!ignoreinput.current) {
        setError(undefined);
      }

      if (isEmpty(currentInput)) {
        setDefaultInUse(true);
      } else {
        setDefaultInUse(false);
      }

      if (isBackspaceKey(key)) {
        if (!ignoreinput.current) {
          // why input and not currentInput? since we want to show the error message only if the user tries to delete the default value
          if (isEmpty(input)) {
            if (!required) setDefaultInUse(false);
            else {
              setError('Default is required since this answer is required.');
            }
          }
        } else if (ignoreTimeout.current) {
          clearTimeout(ignoreTimeout.current);
        }

        ignoreTimeout.current = setTimeout(function () {
          ignoreinput.current = false;
        }, 100);

        ignoreinput.current = true;
      } else if (key.name === 'tab') {
        if (isEmpty(input)) {
          rl.clearLine(0);
          rl.write(config.default);
          setInput(config.default);
          setDefaultInUse(false);
        }
      }
    }
  });

  const message = theme.style.message(config.message, status);
  let formattedValue = input;

  if (status === 'done') {
    return chalk.green(`${prefix} ${message} |${formattedValue}|`);
  }

  const defaultHint = _if(defaultInUse, defaultHintInit, '');
  return [
    `${prefix} ${message} ${formattedValue}`,
    [defaultHint, chalk.red.italic(errorMsg ?? ''), logs.slice(0, 0).join(', ')].filter(Boolean).join('\n'),
  ];
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
