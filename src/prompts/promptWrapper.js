import TextualPrompt from "#prompts/src/textualPrompt/textualPrompt.js";
import BaseMCPrompt from "#prompts/src/baseMCPrompt/baseMCPrompt.js";

export class TextualPromptWrapper {
  constructor() {
    this.config = {
      name: "",
      message: "",
      required: false,
      help: "",
      default: "",
      filter: (x) => x,
      validate: (x) => true,
      transformer: (x) => x,
    };
  }

  name(name) {
    this.config.name = name;
    return this;
  }

  message(message) {
    this.config.message = message;
    return this;
  }

  required(isRequired = true) {
    this.config.required = isRequired;
    return this;
  }

  help(helpText) {
    this.config.help = helpText;
    return this;
  }

  default(defaultValue) {
    this.config.default = defaultValue;
    return this;
  }

  filter(filterFunction) {
    this.config.filter = filterFunction;
    return this;
  }

  validate(validateFunction) {
    this.config.validate = validateFunction;
    return this;
  }

  transformer(transformerFunction) {
    this.config.transformer = transformerFunction;
    return this;
  }

  async prompt() {
    return await TextualPrompt(this.config);
  }
}

export class BaseMCPromptWrapper {
  constructor() {
    this.config = {
      name: "",
      message: "",
      help: "",
      choices: [],
      default: "",
      pageSize: 10,
      loop: false,
      delay: 0,
    };
  }

  name(name) {
    this.config.name = name;
    return this;
  }

  message(message) {
    this.config.message = message;
    return this;
  }

  help(helpText) {
    this.config.help = helpText;
    return this;
  }

  choices(choices) {
    this.config.choices = choices;
    return this;
  }

  default(defaultValue) {
    this.config.default = defaultValue;
    return this;
  }

  pageSize(pageSize) {
    this.config.pageSize = pageSize;
    return this;
  }

  loop(loop = true) {
    this.config.loop = loop;
    return this;
  }

  delay(delay) {
    this.config.delay = delay;
    return this;
  }

  async prompt() {
    return await BaseMCPrompt(this.config);
  }
}
