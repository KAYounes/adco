import BaseMCPrompt from "#prompts/src/baseMCPrompt/baseMCPrompt.js";

export async function startConfirmPromptTest() {
  await BaseMCPrompt(
    {
      message: "ARE YOU SURE?!",
      choices: ["yes", "no"],
      delay: 2000,
    },
    { status: "loading" }
  );
}
