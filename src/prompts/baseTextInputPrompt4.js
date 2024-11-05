import { _if, I, isEmpty } from "#utilities/util.js";
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
import { usePrefix } from "./usePrefix.js";

const BaseTextInputPrompt = createPrompt((config, done) => {
  const theme = makeTheme(config.theme);
  const [input, setInput] = useState("");
  const [errorMsg, setError] = useState();
  const [status, setStatus] = useState("idle");
  const prefix = usePrefix({ status, theme });
  const {
    required = false,
    validate = () => true,
    filter = I,
    transformer = I,
  } = config;
  const ignoreinput = useRef(false);
  const ignoreTimeout = useRef();
  const [defaultInUse, setDefaultInUse] = useState(Boolean(config.default));
  const [logs, setLogs] = useState([]);

  const defaultHintInit = chalk.gray(
    `Default [${chalk.yellow(config.default)}]: ${chalk.underline(
      "remove (backspace)"
    )} | ${chalk.underline("edit (tab)")}`
  );

  useKeypress(async (key, rl) => {
    const currentInput = rl.line;
    setError(undefined); //reset error state

    if (isEnterKey(key)) {
      const answer = resolveAnswer(input, defaultInUse, config.default);
      const [valid, error] = isValidAnswer(answer, required, validate);

      if (valid) {
        setInput(answer);
        setStatus("done");
        done(filter(answer));
      } else {
        setError(error);
        rl.write(input);
      }
    } else {
      setInput(currentInput);

      setDefaultInUse(resolveUseDefault(config.default, isEmpty(currentInput)));

      if (isBackspaceKey(key)) {
        if (!ignoreinput.current) {
          // why input and not currentInput?
          // since we want to show the error message only
          //    if the user tries to delete the default value
          if (isEmpty(input)) {
            setDefaultInUse(resolveUseDefault(config.default, required));
            if (required && config.default)
              setError("Default is required since this answer is required.");
          }
        } else if (ignoreTimeout.current) {
          clearTimeout(ignoreTimeout.current);
        }

        ignoreTimeout.current = setTimeout(function () {
          ignoreinput.current = false;
        }, 100);

        ignoreinput.current = true;
      } else if (key.name === "tab") {
        if (isEmpty(input) && defaultInUse) {
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

  if (status === "done") {
    return chalk.green(`${prefix} ${message} |${formattedValue}|`);
  }

  const defaultHint = _if(defaultInUse, defaultHintInit, "");
  return [
    `${prefix} ${message} ${formattedValue}`,
    [defaultHint, chalk.red.italic(errorMsg ?? ""), logs.slice(0, 0).join(", ")]
      .filter(Boolean)
      .join("\n"),
  ];

  function isValidAnswer(input, required, validate) {
    if (isEmpty(input)) {
      if (required) {
        // if input is empty but it is required
        return [false, "This cannot be left empty!"];
      }
    }

    const validity = validate(input);

    if (validity === true) {
      return [true, ""];
    }

    // If validity is a string, use it as the error message
    return [
      false,
      typeof validity === "string" ? validity : "Your answer was not valid!",
    ];
  }

  function resolveAnswer(input, defaultInUse, defaultValue) {
    if (isEmpty(input)) {
      if (defaultInUse) return defaultValue;
    }

    return input;
  }

  function resolveUseDefault(defaultValueExists, check) {
    if (defaultValueExists) {
      return check;
    }
    return false;
  }
});

export default BaseTextInputPrompt;
