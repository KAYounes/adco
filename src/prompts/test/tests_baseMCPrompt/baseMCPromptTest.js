import { BaseMCPrompt } from "#prompts/src/baseMCPrompt/baseMCPrompt.js";
import { Separator } from "@inquirer/core";
import chalk from "chalk";

export async function startBaseMCPromptTest() {
  await BaseMCPrompt({
    message: "Please select your preferred option from the list below",
    whenAnswered: "Installation Preference",
    help: "tip: just choose",
    choices: [
      {
        name: "Basic Setup",
        value: "basic_setup",
        short: "Basic",
      },
      {
        name: "Advanced Configuration",
        value: "advanced_config",
        short: "Advanced",
        description:
          "Customize the setup with advanced options for greater flexibility and control over the environment.",
        disabled: false,
      },
      {
        name: "Minimal Installation",
        value: "minimal_install",
        short: "Minimal",
        description:
          "A lightweight installation with only essential components to keep things streamlined.",
        disabled: true, // Option disabled as an example
      },
      {
        name: "Help and Documentation",
        value: "help_docs",
        short: "Help",
        description:
          "View documentation and guidance on different configuration options and best practices.",
      },
      {
        name: "Exit Setup",
        value: "exit",
        short: "Exit",
        description: "Exit the setup process without making any changes.",
      },
      {
        name: "Custom Configuration",
        value: "custom_config",
        short: "Custom",
        description:
          "Provide your own configuration settings tailored to your specific needs.",
      },
      {
        name: "Full Installation",
        value: "full_install",
        short: "Full",
        description:
          "Install all available components and features for the complete experience.",
      },
      {
        name: "Update Existing Configuration",
        value: "update_config",
        short: "Update",
        description:
          "Modify your existing configuration settings without a complete reinstall.",
      },
      {
        name: "Use Default Settings",
        value: "default_settings",
        short: "Default",
        description:
          "Proceed with the default settings and configurations for quick setup.",
      },
      {
        name: "Rollback Previous Installation",
        value: "rollback",
        short: "Rollback",
        description:
          "Revert to the previous version of the installation if available.",
      },
      {
        name: "Run Diagnostics",
        value: "run_diagnostics",
        short: "Diagnostics",
        description:
          "Run system diagnostics to check for potential issues before installation.",
      },
      {
        name: "Feedback and Suggestions",
        value: "feedback",
        short: "Feedback",
        description:
          "Provide feedback on the installation process or suggest new features.",
      },
      new Separator("\r-"),
      // new Separator(chalk.gray.underline('\r   end\n\n\r start')),
    ],
  });
}
