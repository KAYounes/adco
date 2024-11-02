import {
  createPrompt,
  useState,
  useKeypress,
  usePrefix,
  usePagination,
  useRef,
  useMemo,
  useEffect,
  isBackspaceKey,
  isEnterKey,
  isUpKey,
  isDownKey,
  isNumberKey,
  Separator,
  ValidationError,
  makeTheme,
} from '@inquirer/core';
import figures from '@inquirer/figures';
import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';
import { defualtTheme, isSelectable, normalizeChoices } from './common.js';
import { _if, getValue } from '#utilities/util.js';
import { isValue } from '#utilities/checks.js';
import { getRawLength } from '#utilities/chalkUtils.js';

const BaseMCPrompt = createPrompt(function (config, done) {
  const [status, setStatus] = useState('idle');
  const firstRender = useRef(true);
  const searchTimeoutRef = useRef();

  const theme = makeTheme(defualtTheme, config.theme);

  const prefix = usePrefix({ status, theme });

  const { loop = true, pageSize = 7 } = config;

  const items = useMemo(() => normalizeChoices(config.choices), [config.choices]);

  const bounds = useMemo(() => {
    const first = items.findIndex(isSelectable);
    const last = items.findLastIndex(isSelectable);

    if (first === -1) {
      throw new ValidationError('[select prompt] No selectable choices. All choices are disabled.');
    }

    return { first, last };
  }, [items]);

  const defaultItemIndex = useMemo(() => {
    if (!('default' in config)) return -1;
    return items.findIndex((item) => isSelectable(item) && item.value === config.default);
  }, [config.default, items]);

  const [active, setActive] = useState(defaultItemIndex === -1 ? bounds.first : defaultItemIndex);

  // Safe to assume the cursor position always point to a Choice.
  const selectedChoice = items[active];

  // handle key presses
  useKeypress((key, rl) => {
    clearTimeout(searchTimeoutRef.current);

    // Enter key => set status to done
    if (isEnterKey(key)) {
      setStatus('done');
      done(selectedChoice.value);
    }
    // arrow keys
    else if (isUpKey(key) || isDownKey(key)) {
      rl.clearLine(0);
      if (loop || (isUpKey(key) && active !== bounds.first) || (isDownKey(key) && active !== bounds.last)) {
        const offset = isUpKey(key) ? -1 : 1;
        let next = active;
        do {
          next = (next + offset + items.length) % items.length;
        } while (!isSelectable(items[next]));
        setActive(next);
      }
    }
    // numbers
    else if (isNumberKey(key)) {
      rl.clearLine(0);
      const position = Number(key.name) - 1;
      const item = items[position];
      if (item != null && isSelectable(item)) {
        setActive(position);
      }
    }
    // backspace
    else if (isBackspaceKey(key)) {
      rl.clearLine(0);
    }
    // searching
    else {
      // Default to search
      const searchTerm = rl.line.toLowerCase();
      const matchIndex = items.findIndex((item) => {
        if (Separator.isSeparator(item) || !isSelectable(item)) return false;

        return item.name.toLowerCase().startsWith(searchTerm);
      });

      if (matchIndex !== -1) {
        setActive(matchIndex);
      }

      searchTimeoutRef.current = setTimeout(() => {
        rl.clearLine(0);
      }, 700);
    }
  });

  useEffect(
    () => () => {
      clearTimeout(searchTimeoutRef.current);
    },
    [],
  );

  const message = theme.style.message(config.message, status);

  //   let helpMessage = config.help ? theme.style.help(config.help) : '';
  const helpMessage = _if(config.help, theme.style.help(config.help), null);
  const useArrowKeys = theme.style.help('(Use arrow keys)');

  const page = usePagination({
    items,
    active,
    renderItem({ item, index, isActive }) {
      let itemText = item.name;
      let itemUserArrowKeys = '';
      if (Separator.isSeparator(item)) {
        return ` ${item.separator}`;
      }

      // useArrowKeys message for first item in the list of choices
      if (index === 0) {
        if (theme.helpMode === 'always' || (theme.helpMode === 'auto' && firstRender.current)) {
          firstRender.current = false;
          itemUserArrowKeys = useArrowKeys;
        }
      }

      if (item.disabled) {
        const disabledLabel = typeof item.disabled === 'string' ? item.disabled : '(disabled)';
        return theme.style.disabled(`${disabledLabel} ${itemText}${itemUserArrowKeys}`);
      }

      const padding = getRawLength(prefix) + getRawLength(itemText);
      const color = isActive ? theme.style.currentChoice : chalk.dim;
      return color(`${itemText}`);
    },
    pageSize,
    loop,
  });

  const whenAnswered = theme.style.message(config.whenAnswered, status);
  if (status === 'done') {
    return `${prefix} ${whenAnswered}${theme.style.answer(selectedChoice.short)}`;
  }

  //   const choiceDescription = selectedChoice.description
  //     ? `\n${theme.indentation}${theme.style.description(
  //         selectedChoice.description.split('\n').join('\n' + theme.indentation),
  //       )}`
  //     : ``;

  const paddedPages = page
    .split('\n')
    .map((i) => ' '.repeat(getRawLength(prefix)) + i)
    .join('\n');
  const choiceDescription = _if(selectedChoice.description, theme.style.description(selectedChoice.description), null);
  const firstLine = [prefix, message, helpMessage].filter(Boolean).join('');
  const choices = paddedPages;
  const moreLine = _if(choiceDescription, `\n${chalk.cyan('More:')}\n${choiceDescription}`);
  const prompt = [firstLine, choices, moreLine, ansiEscapes.cursorHide];
  return prompt.join('\n');
  //   return `
  // ${prefix} ${message} ${helpMessage}
  // ${page}

  // ${_if(choiceDescription, chalk.gray('More: '), '')}
  // ${choiceDescription}
  // `.filter();
  //   return [
  //     [prefix, message, helpMessage],
  //     page,
  //     '',
  //     _if(choiceDescription, chalk.gray('More: '), ''),
  //     choiceDescription,
  //     ansiEscapes.cursorHide,
  //   ]
  //     .filter(function (v, i) {
  //       if (v instanceof Array) {
  //         return v.filter(Boolean);
  //       }
  //       return v !== undefined && v !== null;
  //     })
  //     .join('\n');

  //   return `\n${[prefix, ' '.repeat(5), message, helpMessage, ' '.repeat(5), prefix].join(
  //     ' ',
  //   )}\n\n${page}\n${theme.indentation}${chalk.gray(figures.lineDashed4.repeat(20))}${choiceDescription}${ansiEscapes.cursorHide}\n\n\n\n\n\n\n`;
});

export { BaseMCPrompt };
