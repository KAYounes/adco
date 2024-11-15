import TextualInputPrompt from "#prompts/textualInputPrompt/textualInputPrompt.js";

export async function Test_TextualInputPrompt() {
  const answer = await TextualInputPrompt({
    message: "What is your name?",
    // required: true,
    default: "John Smith",
    validate: (input) => (input?.length > 3 ? true : "Answer too short (4)"),
  });

  console.log(`answer: ${answer}`);
}
