import figures from '@inquirer/figures';
import { Separator } from '@inquirer/core';
import chalk from 'chalk';
import { getRawLength } from '#utilities/chalkUtils.js';

export const STATUS = {
  idle: 'idle',
  loading: 'loading',
  done: 'done',
};

const idlePrefix = 'Q?: ';

const spinners = {
  classicSpinner: ['|', '/', '-', '\\'],
  dotSpinner: ['.  ', '.. ', '...', '.. ', '.  '],
  brailleSpinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'], // Note: Braille might not render on older Windows
  pulseSpinner: ['◐', '◓', '◑', '◒'],
  arrowSpinner: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],

  // New spinners
  squareSpinner: ['■', '□', '■', '□'], // Alternates between filled and empty squares
  plusMinusSpinner: ['+', '×', '-', '×'], // Rotating plus and minus
  lineBounceSpinner: ['-', '=', '≡', '=', '-'], // Bouncing line length
  rotatingPipeSpinner: ['┤', '┘', '┴', '└', '├', '┌', '┬', '┐'], // Spinning with corner pipes
  triangleSpinner: ['◢', '◣', '◤', '◥'], // Rotating triangle
  moonSpinner: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'], // Phases of the moon
  clockSpinner: ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'], // Clock emoji rotating through hours
  heartsSpinner: ['💙', '💚', '💛', '💜', '💗'], // Rotating hearts

  // For simpler ASCII environments
  basicBounce: ['.', 'o', 'O', 'o', '.'], // Bouncing dot
  expandingArrow: ['>', '>>', '>>>', '>>', '>'], // Expanding arrow
  waveDots: ['∙∙∙', '●∙∙', '∙●∙', '∙∙●', '∙∙∙'], // Dots moving in a wave
  snakeSpinner: ['▁', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃'], // Snake-like animation with bars
  halfMoonSpinner: ['◑', '◒', '◐', '◓'], // Rotating half moon

  // Character-based spinners
  lineSpinner: ['-', '\\', '|', '/'], // Simple line spinner
  circleSpinner: ['◴', '◷', '◶', '◵'], // Circular rotation
  bounceBox: ['▖', '▘', '▝', '▗'], // Bouncing small box in corners

  growingCircle: ['.', '..', '... ', ' ..', '  .', '  ?', '  .', ' ..', '...'],
};

export const defualtTheme = {
  spinner: {
    interval: 130,
    frames: spinners.growingCircle.map((i) => chalk.yellow(i.padEnd(idlePrefix.length))),
  },
  prefix: {
    idle: chalk.magenta(idlePrefix),
    done: chalk.green('QA: '),
    loading: {
      speed: 500,
    },
  },
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

export function padStringLines(string, prefix) {
  const prefixLength = getRawLength(prefix);
  return string
    .split('\n')
    .map((line) => ' '.repeat(prefixLength) + line)
    .join('\n');
}
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
