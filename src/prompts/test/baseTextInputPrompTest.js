import BaseTextInputPrompt from '#prompts/baseTextInputPrompt2.js';
import { handleEmptySpaces } from '#prompts/common.js';

export function startTextInputPromptTest() {
  BaseTextInputPrompt({
    message: 'What is your name?',
    // required: true,
    default: 'John Smith',
    // validate: () => false,
    transformer: (input) => handleEmptySpaces(input),
    filter: (input) => handleEmptySpaces(input),
  });
}
