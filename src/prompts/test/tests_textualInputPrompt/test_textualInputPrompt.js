import TextualInputPrompt from "#prompts/textualInputPrompt/textualInputPrompt.js";

export async function Test_TextualInputPrompt() {
  const answer = await TextualInputPrompt({
    message: "What is your name?",
    // required: true,
    // default: "John Smith",
    // validate: (input) => (input?.length > 3 ? true : false),
    // transformer: (input) => "=> " + input,
    // filter: (input) => "'" + input + "'",
  });

  console.log(`answer: ${answer}`);
}
