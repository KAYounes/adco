import { defualtTheme, padStringLines, STATUS } from "#prompts/common.js";
import { usePrefix } from "#prompts/usePrefix.js";
import { _if, fallback, I, isEmpty } from "#utilities/util.js";
import {
  createPrompt,
  isEnterKey,
  makeTheme,
  useKeypress,
  useState,
} from "@inquirer/core";
import chalk from "chalk";
const logs = [];
const log = false;
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

  const prefix = usePrefix({ status, theme });

  /////////////////////////////////////////////////////////////////////////////
  useKeypress(async function (keyPressed, lineReader) {
    await undefined; // this is needed for the prefix to update for some reason;

    const currentLine = lineReader.line;
    setError(undefined);

    // Handle 'ENTER' press
    //
    if (isEnterKey(keyPressed)) {
      const answer = input;

      // handle empty submissions
      if (isEmpty(answer)) {
        if (required) {
          setError("You need to answer this question!");
          return;
        }
      }

      // handle invalid submissions
      if (validate(answer) !== true) {
        lineReader.write(input); // preserve current line

        const _error = validate(answer);
        setError(_error ? _error : "Answer is not valid");

        return; // exit
      }

      // submission is valid
      setInput(answer);
      setStatus("done");
      done(filter(answer));

      return; // exit
    }

    // Handle 'TAB' press
    //
    if (keyPressed.name === "tab") {
      // remove tab characters
      lineReader.clearLine(0);
      lineReader.write(input);

      // load default - if the input was empty before 'tab' was pressed
      if (isEmpty(input) && config.default) {
        lineReader.write(config.default);
        setInput(config.default);
      }

      return; // exit
    }

    setInput(currentLine);
  });
  /////////////////////////////////////////////////////////////////////////////

  const message = resolve_prompt_msg(required, config.message, theme, status);
  const defaultMessage = resolve_default_msg(config.default, input);
  const errorMessage = resolve_error_msg(error);
  let formattedValue = transformer(input);

  return resolve_prompt(
    status,
    prefix,
    message,
    formattedValue,
    defaultMessage,
    errorMessage
  );
});

export default TextualInputPrompt;
//
//
//
//
//
//
function resolve_default_msg(defaultValue, currentLine) {
  if (!defaultValue) return "";

  // if current line is not empty
  if (currentLine)
    // hide (tab)
    return chalk.gray(`Default: [${chalk.yellow(defaultValue)}]`);

  // else show (tab)
  return chalk.gray(
    `Default: [${chalk.yellow(defaultValue)}] (${chalk.yellow.italic("tab")})`
  );
}

function resolve_error_msg(error) {
  if (error) {
    return chalk.red.italic(`Error: ${error}`);
  }
}

function resolve_prompt(
  status,
  prefix,
  message,
  formattedValue,
  defaultMessage,
  errorMessage
) {
  let gap = " ";
  let first_line = "";
  let second_line = "";

  let prompt = [prefix];
  let aux_line = [defaultMessage, errorMessage];

  prompt.push(message);
  prompt.push(gap);
  prompt.push(formattedValue);

  if (status !== STATUS.done) {
    second_line = aux_line.filter(Boolean).join("\n");
  }

  first_line = prompt.join("");
  return [first_line, padStringLines(second_line, prefix)];
}

function resolve_prompt_msg(required, message, theme, status) {
  let prompt = "";
  if (status !== STATUS.done) {
    if (required) prompt = "(required) ";
    prompt = message;
  }

  return theme.style.message(message, status);
}
