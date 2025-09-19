export type {
    ColorName,
    BackgroundName,
    StyleOptions,
    ColorizeOptions,
    ColoredConsoleOptions,
    ColoredConsoleTheme,
    LogLevel,
    ConsoleWriter
} from './colorConsole.js';
export {
    createColoredConsole,
    ColoredConsole,
    colorize,
    applyStyle,
    detectColorSupport,
    ansi
} from './colorConsole.js';
export { cwTheme, createCwLogger } from './themes/cw.js';
