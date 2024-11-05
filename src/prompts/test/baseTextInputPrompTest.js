import BaseTextInputPrompt from '#prompts/baseTextInputPrompt.js';

export function startTextInputPromptTest() {
  BaseTextInputPrompt({
    message: 'What is your name?',
    validate: () => false,
  });
}
