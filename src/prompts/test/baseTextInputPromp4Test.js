import BaseTextInputPrompt from '#prompts/baseTextInputPrompt4.js';
import { handleEmptySpaces } from '#prompts/common.js';

export async function startTextInputPrompt4Test() {
  const answer = await BaseTextInputPrompt({
    message: 'What is your name?',
    required: true,
    // default: 'John Smith',
    // filter: (x) => `you said: |${x}|`,
    validate: (input) => (input?.length > 3 ? true : 'Answer too short (4)'),
  });

  console.log(`answer: ${answer}`);
}
