import figures from '@inquirer/figures';
import { Separator } from '@inquirer/core';
import chalk from 'chalk';

export const STATUS = {
  idle: 'idle',
  loading: 'loading',
  done: 'done',
};

export const defualtTheme = {
  // spinner: {
  //   interval: number;
  //   frames: string[];
  // };
  prefix: { idle: chalk.magenta('Q: '), done: chalk.green('QA: ') },
  icon: { cursor: `${figures.play} ` },
  style: {
    currentChoice: function (choice) {
      return chalk.green.underline(choice);
    },
    answer: function (string) {
      return `: ${chalk.cyan(string)}`;
    },
    message: function (string, status) {
      switch (status) {
        case STATUS.idle:
          return chalk.yellow(string);

        case STATUS.loading:
          return chalk.blue(string);

        case STATUS.done:
          return chalk.green(string);
      }
    },
    error: function (string) {
      return chalk.red(string);
    },
    help: function (string) {
      return chalk.gray(string);
    },
    highlight: function (string) {
      return chalk.magenta(string);
    },
    description: function (string) {
      return chalk.gray(string);
    },
    disabled: function (string) {
      return chalk.gray.strikethrough(`${string}`);
    },
  },
  helpMode: 'auto',
  // indentation: 10,
};

export function isSelectable(item) {
  return !Separator.isSeparator(item) && !item.disabled;
}

export function normalizeChoices(choices) {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice)) return choice;

    if (typeof choice === 'string') {
      return {
        value: choice,
        name: choice,
        short: choice,
        disabled: false,
      };
    }

    const name = choice.name ?? String(choice.value);
    return {
      value: choice.value,
      name,
      description: choice.description,
      short: choice.short ?? name,
      disabled: choice.disabled ?? false,
    };
  });
}
