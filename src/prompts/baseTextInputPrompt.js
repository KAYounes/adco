import { createPrompt, useState, useKeypress, isEnterKey, isBackspaceKey, makeTheme } from '@inquirer/core';
import figures from '@inquirer/figures';
import chalk from 'chalk';
import { usePrefix } from './usePrefix.js';
import { getRawLength } from '#utilities/chalkUtils.js';
import { _if, and } from '#utilities/util.js';

const BaseTextInputPrompt = createPrompt((config, done) => {
  const theme = makeTheme(config.theme);

  const [value, setValue] = useState('');
  const [errorMsg, setError] = useState();
  const [status, setStatus] = useState('loading');
  const [defaultValue = '', setDefaultValue] = useState(config.default);
  const prefix = usePrefix({ status, theme });
  const { required = false, validate = () => true, filter, transformer } = config;

  const logs = [];
  useKeypress(async (key, rl) => {
    // Ignore keypress while our prompt is doing other processing.
    // if (status !== 'idle') {
    //   return;
    // }

    if (isEnterKey(key)) {
      //   console.log('enter');
      const answer = value || defaultValue;
      //   setStatus('loading');

      const isValid = _if(and(required, !answer), 'A value is required', await validate(answer));
      //   const validAnswer = required && (await validate(answer));

      // if user sybmited a valid answer, (=== true) is required since a string can be retured to be use as the error message.
      if (isValid === true) {
        setValue(answer);
        setStatus('done');

        if (typeof filter === 'function') {
          done(filter(answer));
        } else {
          done(answer);
        }
      } else {
        rl.write(value);
        setError(isValid || 'A correct value is required!');
      }
    } else if (isBackspaceKey(key) && !value && !required) {
      setDefaultValue(undefined);
    } else if (key.name === 'tab' && !value && !defaultValue) {
      rl.clearLine(0); // Remove the tab character.
      setDefaultValue(config.default);
    } else if (key.name === 'tab' && !value) {
      // setDefaultValue(undefined);
      rl.clearLine(0); // Remove the tab character.
      rl.write(defaultValue);
      setValue(defaultValue);
    } else {
      setValue(rl.line);
      setError(undefined);
    }
  });

  const message = theme.style.message(config.message, status);
  let formattedValue = value;
  if (typeof transformer === 'function') {
    formattedValue = transformer(value, { isFinal: status === 'done' });
  } else if (status === 'done') {
    formattedValue = theme.style.answer(value);
  }

  let defaultStr;
  if (defaultValue && status !== 'done' && !value) {
    defaultStr = chalk.italic.gray(`['Tab' to edit defualt (${defaultValue}) ${chalk.italic(figures.play)}]`);
  } else if (config.default && !defaultValue && status !== 'done' && !value) {
    defaultStr = chalk.italic.gray(`['Tab' to use defualt (${config.default}) ${chalk.italic(figures.play)}]`);
  }

  let error = undefined;

  if (errorMsg) {
    error = theme.style.error(errorMsg);
  }

  let help = undefined;
  if (config.help) {
    help = chalk.gray.italic(`${figures.lineUpRightArc} ${chalk.italic('help')}: ${config.help}`);
  }

  if (status === 'done') {
    return chalk.green(`${prefix} ${message} ${formattedValue}`);
  }

  return [`${prefix} ${message} ${formattedValue}`, error];
  //   return [
  //     [prefix, help ? chalk.gray(figures.lineDownRightArc) : undefined, message, defaultStr, error, formattedValue]
  //       .filter((query) => query !== undefined)
  //       .join(' '),
  //     help,
  //   ];
});

export default BaseTextInputPrompt;
