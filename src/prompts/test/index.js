import { startBaseMCPromptTest } from "./tests_baseMCPrompt/baseMCPromptTest.js";
import { startConfirmPromptTest } from "./tests_baseMCPrompt/confirmPromptTest.js";
import { startTextualPromptTest } from "./tests_textualPrompt/test_textualInput.js";

await startBaseMCPromptTest();
await startConfirmPromptTest();
await startTextualPromptTest();
