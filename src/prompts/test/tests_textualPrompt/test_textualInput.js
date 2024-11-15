import TextualPrompt from "#prompts/src/textualPrompt/textualPrompt.js";

export async function startTextualPromptTest() {
  const answer = await TextualPrompt({
    message: "What is your name?",
    required: true,
    default: "John Smith",
    validate: (input) => (input?.length > 3 ? true : false),
    transformer: (input) => "=> " + input,
    filter: (input) => "'" + input + "'",
  });

  return answer;
}
