import {
    createColoredConsole,
    type ColoredConsole,
    type ColoredConsoleOptions,
    type ColoredConsoleTheme
} from '../colorConsole.js';

export const cwTheme: ColoredConsoleTheme = {
    info: { color: 'cyan' },
    success: { color: 'green' },
    warn: { color: 'yellow', bold: true },
    error: { color: 'red', bold: true },
    debug: { color: 'magenta', dim: true }
};

const defaultOptions: ColoredConsoleOptions = {
    theme: cwTheme
};

export function createCwLogger(options: ColoredConsoleOptions = {}): ColoredConsole {
    return createColoredConsole({ ...defaultOptions, ...options });
}
