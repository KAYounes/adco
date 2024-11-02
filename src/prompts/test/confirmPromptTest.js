import { BaseMCPrompt } from "#prompts/baseMCPrompt.js";

export function startConfirmPromptTest(){
  BaseMCPrompt({
    message: "ARE YOU SURE?!",
    choices: [
      'yes','no'
    ],
    delay: 10000
  }, {status: 'loading'})
}