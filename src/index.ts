export type {
    ColorName,
    BackgroundName,
    StyleOptions,
    ColorizeOptions,
    ColoredConsoleOptions,
    ColoredConsoleTheme,
    LogLevel,
    ConsoleWriter
} from './colorConsole';
export {
    createColoredConsole,
    ColoredConsole,
    colorize,
    applyStyle,
    detectColorSupport,
    ansi
} from './colorConsole';
