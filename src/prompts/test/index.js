import { startBaseMCPromptTest } from "./tests_baseMCPrompt/baseMCPromptTest.js";
import { startConfirmPromptTest } from "./tests_baseMCPrompt/confirmPromptTest.js";
import { startTextualInputPromptTest } from "./tests_textualInputPrompt/test_textualInput.js";

await startBaseMCPromptTest();
await startConfirmPromptTest();
await startTextualInputPromptTest();
