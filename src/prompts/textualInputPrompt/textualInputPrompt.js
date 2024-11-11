import { defualtTheme } from "#prompts/common.js";
import { usePrefix } from "#prompts/usePrefix.js";
import { _if, fallback, I, isEmpty } from "#utilities/util.js";
import {
  createPrompt,
  isBackspaceKey,
  isEnterKey,
  makeTheme,
  useKeypress,
  useRef,
  useState,
} from "@inquirer/core";
import chalk from "chalk";
const logs = [];
const log = true;
const TextualInputPrompt = createPrompt((config, done) => {
  const {
    required = false,
    validate = () => true,
    filter = I,
    transformer = I,
  } = config;

  const theme = makeTheme(defualtTheme);

  const [status, setStatus] = useState("loading");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isDefaultActive, setIsDefaultActive] = useState(config.default);
  // const [showDefaultMsg, setShowDefaultMsg] = useState(Boolean(config.default));

  const ignoreinput = useRef(false);
  const ignoreTimeout = useRef();

  const prefix = usePrefix({ status, theme });

  useKeypress(async function (keyPressed, lineReader) {
    await undefined; // this is needed for the prefix to update for some reason;

    const currentLine = lineReader.line;
    logs.push("1");
    logs.push(input)
    setError(undefined);

    if (isEnterKey(keyPressed)) {
      logs.push("2");
      const answer = _resolve_answer(input, config.default, isDefaultActive);

      if (isEmpty(answer)) {
        logs.push("3");
        if (required) {
          setError("You need to answer this question!");
          return;
        }
      } else if (validate(answer) !== true) {
        logs.push("4");
        lineReader.write(input);
        setInput(input)
        setError(validate(answer));
        return;
      }

      logs.push("5");

      setInput(answer);
      setStatus("done");
      done(filter(answer));
      return;
    }

    logs.push("6");
    if (isBackspaceKey(keyPressed)) {
      logs.push("7");

      setInput(currentLine);
      if (!ignoreinput.current) {
        logs.push("8");
        if (isEmpty(input)) {
          logs.push("9");
          if (required)
            setError("Default cannot be removed for a required answer");
          else setIsDefaultActive(false);
        }
      } else if (ignoreTimeout.current) {
        logs.push("10");
        // setError(error); // preserve error since it will be set to udnefined if backspace was pressed during the ignoreTImeout period
        clearTimeout(ignoreTimeout.current);
      }

      logs.push("11");
      ignoreTimeout.current = setTimeout(function () {
        ignoreinput.current = false;
      }, 100);

      ignoreinput.current = true;

      return;
    }

    logs.push("12");
    if (keyPressed.name === "tab") {
      logs.push("13");
      if (isDefaultActive) {
        logs.push("14");
        lineReader.write(config.default);
        setInput(config.default);
      }

      return;
    }

    logs.push("15");
    setInput(currentLine);
  });

  const message = theme.style.message(config.message, status);
  let formattedValue = input;

  setIsDefaultActive(isEmpty(input));
  if (status === "done") {
    return [
      [prefix, message, input].join(" "),
      logs.slice(0, log ? undefined : 0).join(", "),
    ];
  }

  const defaultMessage = getDefaultMessage(config.default, isDefaultActive);
  const errorMessage = getErrorMessage(error);

  return [
    [prefix, message, input].join(" "),
    [
      defaultMessage,
      errorMessage,
      logs.slice(0, log ? undefined : 0).join(", "),
    ].join("\n"),
  ];
  // const defaultHint = _if(defaultInUse, defaultHintInit, "");
  // return [
  //   `${prefix} ${message} ${formattedValue}`,
  //   [defaultHint, chalk.red.italic(errorMsg ?? ""), logs.slice(0, 0).join(", ")]
  //     .filter(Boolean)
  //     .join("\n"),
  // ];
});

export default TextualInputPrompt;

function getDefaultMessage(defaultValue, isDefaultActive) {
  if (!defaultValue || !isDefaultActive) return "";

  return chalk.gray(
    `Default [${chalk.yellow(defaultValue)}]: ${chalk.underline(
      "remove (backspace)"
    )} | ${chalk.underline("edit (tab)")}`
  );
}

function getErrorMessage(error) {
  return chalk.red.italic.underline(fallback(error, ""));
}

function _resolve_answer(inputedValue, defaultValue, isDefaultActive) {
  if (isEmpty(inputedValue) && isDefaultActive) return defaultValue;
  return inputedValue;
}
