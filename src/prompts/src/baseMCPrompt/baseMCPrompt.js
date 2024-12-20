import { _if } from "#utilities/util.js";
import {
  createPrompt,
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isNumberKey,
  isUpKey,
  makeTheme,
  Separator,
  useEffect,
  useKeypress,
  useMemo,
  // usePrefix,
  usePagination,
  useRef,
  useState,
  ValidationError,
} from "@inquirer/core";
import ansiEscapes from "ansi-escapes";
import chalk from "chalk";
import {
  defualtTheme,
  isSelectable,
  normalizeChoices,
  padStringLines,
  toEmptyLines,
} from "#prompts/common/common.js";
import { usePrefix } from "#prompts/common/usePrefix.js";

const BaseMCPrompt = createPrompt(function (config, done) {
  const [locked, setLocked] = useState(config?.delay > 0 ? true : false);
  const [status, setStatus] = useState(locked ? "loading" : "idle");

  const firstRender = useRef(true);
  const searchTimeoutRef = useRef();
  const theme = makeTheme(defualtTheme, config.theme);

  const prefix = usePrefix({ status, theme });

  const { loop = true, pageSize = 7 } = config;

  const items = useMemo(
    () => normalizeChoices(config.choices),
    [config.choices]
  );

  const bounds = useMemo(() => {
    const first = items.findIndex(isSelectable);
    const last = items.findLastIndex(isSelectable);

    if (first === -1) {
      throw new ValidationError(
        "[select prompt] No selectable choices. All choices are disabled."
      );
    }

    return { first, last };
  }, [items]);
  const defaultItemIndex = useMemo(() => {
    if (!("default" in config)) return -1;
    return items.findIndex(
      (item) => isSelectable(item) && item.value === config.default
    );
  }, [config.default, items]);
  const [active, setActive] = useState(
    defaultItemIndex === -1 ? bounds.first : defaultItemIndex
  );

  // Safe to assume the cursor position always point to a Choice.
  const selectedChoice = items[active];

  useEffect(function () {
    if (!locked) return;

    const timer = setTimeout(function () {
      setLocked(false);
      setStatus("idle");
    }, config.delay);

    return () => clearTimeout(timer);
  }, []);

  // handle key presses
  useKeypress((key, rl) => {
    clearTimeout(searchTimeoutRef.current);
    if (locked) return;

    // Enter key => set status to done
    if (isEnterKey(key)) {
      setStatus("done");
      done(selectedChoice.value);
    }
    // arrow keys
    else if (isUpKey(key) || isDownKey(key)) {
      rl.clearLine(0);
      if (
        loop ||
        (isUpKey(key) && active !== bounds.first) ||
        (isDownKey(key) && active !== bounds.last)
      ) {
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
    []
  );

  const message = theme.style.message(config.message, status);

  //   let helpMessage = config.help ? theme.style.help(config.help) : '';
  const helpMessage = _if(config.help, theme.style.help(config.help), null);
  const useArrowKeys = theme.style.help("(Use arrow keys)");

  const page = usePagination({
    items,
    active,
    renderItem({ item, index, isActive }) {
      let itemText = item.name;
      let itemUserArrowKeys = "";
      if (Separator.isSeparator(item)) {
        return ` ${item.separator}`;
      }

      // useArrowKeys message for first item in the list of choices
      if (index === 0) {
        if (
          theme.helpMode === "always" ||
          (theme.helpMode === "auto" && firstRender.current)
        ) {
          firstRender.current = false;
          itemUserArrowKeys = useArrowKeys;
        }
      }

      if (item.disabled) {
        const disabledLabel =
          typeof item.disabled === "string" ? item.disabled : "(disabled)";
        return theme.style.disabled(
          `${disabledLabel} ${itemText}${itemUserArrowKeys}`
        );
      }

      const color = isActive ? theme.style.currentChoice : chalk.dim;
      return color(`${itemText}`);
    },
    pageSize,
    loop,
  });

  if (status === "done") {
    return `${prefix}${message}${theme.style.answer(selectedChoice.short)}`;
  }

  const choiceDescription = _if(
    selectedChoice.description,
    theme.style.description(selectedChoice.description),
    null
  );

  // first line of the promt
  const firstLine = [prefix, message, helpMessage].filter(Boolean).join("");

  // prompt choices
  // replace choices when locked with empty lines to avoid flickering when unlocking
  const choices = locked ? toEmptyLines(page) : padStringLines(page, prefix);

  // lines below the choices (e.g. choice description)
  const moreLine = padStringLines(
    _if(
      choiceDescription,
      `\n${chalk.cyan("More:")}\n${choiceDescription}`,
      ""
    ),
    prefix
  );

  // prompt array
  const prompt = [firstLine, choices, moreLine, ansiEscapes.cursorHide];

  // retrun prompt as a string
  return prompt.join("\n");
});

export { BaseMCPrompt };
