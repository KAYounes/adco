import TextualInputPrompt from "#prompts/src/textualInputPrompt/textualInputPrompt.js";

export async function startTextualInputPromptTest() {
  const answer = await TextualInputPrompt({
    message: "What is your name?",
    required: true,
    default: "John Smith",
    validate: (input) => (input?.length > 3 ? true : false),
    transformer: (input) => "=> " + input,
    filter: (input) => "'" + input + "'",
  });

  return answer;
}
