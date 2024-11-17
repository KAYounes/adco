import chalk from "chalk";
import TextualPrompt from "#prompts/src/textualPrompt/textualPrompt.js";
import { toUpperCamelCase } from "#utilities/textTransformation.js";
import { is_js_keyword, is_valid_function_name } from "#utilities/checks.js";
import { TextualPromptWrapper } from "./promptWrapper.js";

export async function begin_prompts() {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (key) => {
    if (key === "\u001B") {
      console.log(chalk.red('The "ESC" key was pressed, aborting...'));
      process.exit(0);
    }
  });

  //   let _componentName = await TextualPrompt({
  //     name: "component name",
  //     message: "Type the name of the component:",
  //     required: true,
  //     help: "Type a correctly cased function name (LargeButton), or a sequence of words (large button)",
  //     default: "component name",
  //     filter: toUpperCamelCase,
  //     validate: function (input) {
  //       const func = toUpperCamelCase(input);

  //       if (!is_valid_function_name(func))
  //         return "sorry, but this is not a valid function name";
  //       //   if (is_js_keyword(func))
  //       //     return "sorry, this is a reserved JS keyword, and it cannot be used as a function name";
  //       return true;
  //     },
  //   });

  const componentNamePrompt = new TextualPromptWrapper();
  componentNamePrompt
    .name("component name")
    .message("Type the name of the component:")
    .required()
    .help(
      "Type a pascal/camel cased function name (LargeButton/largeButton), or a sequence of words (large button)"
    )
    .default("component name")
    .filter(toUpperCamelCase)
    .validate(function (input) {
      const func = toUpperCamelCase(input);
      if (!is_valid_function_name(func)) {
        return "Sorry, but this is not a valid function name.";
      }
      return true;
    });

  let _componentName = await componentNamePrompt.prompt();
  return { _componentName };
}
