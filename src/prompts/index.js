import chalk from "chalk";
import TextualPrompt from "#prompts/src/textualPrompt/textualPrompt.js";
import { toUpperCamelCase } from "#utilities/textTransformation.js";
import {
  is_js_keyword,
  is_valid_function_name,
  isValue,
} from "#utilities/checks.js";
import { BaseMCPromptWrapper, TextualPromptWrapper } from "./promptWrapper.js";

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

  const component_name_prompt = new TextualPromptWrapper();
  const add_children_props_prompt = new BaseMCPromptWrapper();
  const use_client_dir_prompt = new BaseMCPromptWrapper();
  const use_inline_export_prompt = new BaseMCPromptWrapper();
  const add_css_prompt = new BaseMCPromptWrapper();
  const css_as_module_prompt = new BaseMCPromptWrapper();
  const css_name_prompt = new TextualPromptWrapper();
  const create_index_prompt = new BaseMCPromptWrapper();
  const file_type_prompt = new BaseMCPromptWrapper();
  const as_jsx_prompt = new BaseMCPromptWrapper();

  let _componentName = await component_name_prompt
    .name("component_name")
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
    })
    .prompt();

  let component_parts = {
    use_client_dir: "",
    css_file: "",
    declaration: `function ${_componentName} (CHILDREN_PROPS)`,
    closure: "{ ... }",
  };

  let component_array = [component_parts.declaration, component_parts.closure];

  let component_preview = component_array.join("\n");

  let add_children_props = await add_children_props_prompt
    .name("add_children_props")
    .message("Add children props")
    .default(false)
    .choices([
      {
        value: true,
        name: "Add Children Props",
        short: "YES",
        description: component_preview.replace(
          "CHILDREN_PROPS",
          "{ children }"
        ),
      },
      {
        value: false,
        name: "NO",
        short: "NO",
        description: component_preview.replace("CHILDREN_PROPS", "{ }"),
      },
    ])
    .prompt();

  use_client_dir_prompt
    .name("use_client_dir")
    .message("Use client directive (Next.js)")
    .default(false)
    .choices([
      {
        value: true,
        name: "Add use client directive",
        short: "YES",
        description: '"use client"',
      },
      {
        value: false,
        name: "NO",
        short: "NO",
        description: "",
      },
    ]);

  use_inline_export_prompt
    .name("add_children_props")
    .message("Add children props")
    .default(false)
    .choices([
      {
        value: true,
        name: "Add Children Props",
        short: "YES",
        description: "{ children }",
      },
      {
        value: false,
        name: "NO",
        short: "NO",
        description: "{ }",
      },
    ]);
  add_css_prompt
    .name("add_children_props")
    .message("Add children props")
    .default(false)
    .choices([
      {
        value: true,
        name: "Add Children Props",
        short: "YES",
        description: "{ children }",
      },
      {
        value: false,
        name: "NO",
        short: "NO",
        description: "{ }",
      },
    ]);
  css_as_module_prompt
    .name("add_children_props")
    .message("Add children props")
    .default(false)
    .choices([
      {
        value: true,
        name: "Add Children Props",
        short: "YES",
        description: "{ children }",
      },
      {
        value: false,
        name: "NO",
        short: "NO",
        description: "{ }",
      },
    ]);

  css_name_prompt
    .name("add_children_props")
    .message("Add children props")
    .default(false);

  create_index_prompt
    .name("add_children_props")
    .message("Add children props")
    .default(false)
    .choices([
      {
        value: true,
        name: "Add Children Props",
        short: "YES",
        description: "{ children }",
      },
      {
        value: false,
        name: "NO",
        short: "NO",
        description: "{ }",
      },
    ]);
  file_type_prompt
    .name("add_children_props")
    .message("Add children props")
    .default(false)
    .choices([
      {
        value: true,
        name: "Add Children Props",
        short: "YES",
        description: "{ children }",
      },
      {
        value: false,
        name: "NO",
        short: "NO",
        description: "{ }",
      },
    ]);
  as_jsx_prompt
    .name("add_children_props")
    .message("Add children props")
    .default(false)
    .choices([
      {
        value: true,
        name: "Add Children Props",
        short: "YES",
        description: "{ children }",
      },
      {
        value: false,
        name: "NO",
        short: "NO",
        description: "{ }",
      },
    ]);

  return { _componentName, add_children_props };
}
