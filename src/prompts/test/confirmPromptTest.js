import { BaseMCPrompt } from '#prompts/baseMCPrompt.js';

export function startConfirmPromptTest() {
  BaseMCPrompt(
    {
      message: 'ARE YOU SURE?!',
      choices: ['yes', 'no'],
      delay: 2000,
    },
    { status: 'loading' },
  );
}
