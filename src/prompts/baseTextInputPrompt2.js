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

  const [defaultInUse, setDefaultInUse] = useState(Boolean(config.default))
  const defaultHintInit = chalk.gray(` {${config.default}}`);
  let [useDefault, setUseDefault] = useState(true);
  const logs = [];

  useKeypress(async (key, rl) => {
    if (isEnterKey(key)) {

      const answer = resolveAnswer(input, defaultInUse)
      
      if(isValidAnswer(input, required, validate))
      {
        setStatus('done');
        done(input)

        if (typeof filter === 'function') {
          done(filter(answer));
        } else {
          done(answer);
        }
      }
    }
    else {
      setInput(rl.line); // read input
      setError(undefined);
    }
  });

  const message = theme.style.message(config.message, status);
  let formattedValue = input;

  if (status === 'done') {
    return chalk.green(`${prefix} ${message} |${formattedValue}|`);
  }

  const defaultHint = _if(useDefault, ' ' + defaultHintInit, '');
  return [`${prefix} ${message}${defaultHint} ${formattedValue}`];
});

export default BaseTextInputPrompt;

function isValidAnswer(input, required, validate)
{
  if(!input)
  {
    if(required)
    {
      return false
    }
  }

  return validate(input)
}

function resolveAnswer(input, defaultInUse)
{
  
}