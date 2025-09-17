const RESET = '\u001b[0m';
const STYLE_CODES = {
    bold: '\u001b[1m',
    dim: '\u001b[2m',
    italic: '\u001b[3m',
    underline: '\u001b[4m'
} as const;

const FOREGROUND_CODES = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    gray: 90,
    grey: 90,
    redBright: 91,
    greenBright: 92,
    yellowBright: 93,
    blueBright: 94,
    magentaBright: 95,
    cyanBright: 96,
    whiteBright: 97
} as const;

const BACKGROUND_CODES = Object.fromEntries(
    Object.entries(FOREGROUND_CODES).map(([key, value]) => [key, value + 10])
) as Record<keyof typeof FOREGROUND_CODES, number>;

export type ColorName = keyof typeof FOREGROUND_CODES;
export type BackgroundName = keyof typeof BACKGROUND_CODES;

export interface StyleOptions {
    color?: ColorName;
    background?: BackgroundName;
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    underline?: boolean;
}

export interface ColorizeOptions {
    enabled?: boolean;
}

export type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';

export type ColoredConsoleTheme = Partial<Record<LogLevel, StyleOptions>>;

export interface ColoredConsoleOptions {
    name?: string;
    nameStyle?: StyleOptions;
    theme?: ColoredConsoleTheme;
    enabled?: boolean;
    writer?: ConsoleWriter;
}

export interface ConsoleWriter {
    log: (...args: unknown[]) => void;
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
    debug?: (...args: unknown[]) => void;
}

const DEFAULT_THEME: Record<LogLevel, StyleOptions> = {
    info: { color: 'cyan' },
    success: { color: 'green' },
    warn: { color: 'yellow', bold: true },
    error: { color: 'red', bold: true },
    debug: { color: 'magenta', dim: true }
};

const DEFAULT_NAME_STYLE: StyleOptions = { color: 'white', dim: true };

export function detectColorSupport(): boolean {
    if (process.env.NO_COLOR) {
        return false;
    }

    if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') {
        return true;
    }

    return Boolean(process.stdout && process.stdout.isTTY);
}

export function applyStyle(
    text: string,
    style?: StyleOptions,
    options: ColorizeOptions = {}
): string {
    if (!style) {
        return text;
    }

    const enabled = options.enabled ?? detectColorSupport();
    if (!enabled) {
        return text;
    }

    const parts: string[] = [];

    if (style.bold) {
        parts.push(STYLE_CODES.bold);
    }
    if (style.dim) {
        parts.push(STYLE_CODES.dim);
    }
    if (style.italic) {
        parts.push(STYLE_CODES.italic);
    }
    if (style.underline) {
        parts.push(STYLE_CODES.underline);
    }
    if (style.color) {
        parts.push(`\u001b[${FOREGROUND_CODES[style.color]}m`);
    }
    if (style.background) {
        parts.push(`\u001b[${BACKGROUND_CODES[style.background]}m`);
    }

    if (parts.length === 0) {
        return text;
    }

    return `${parts.join('')}${text}${RESET}`;
}

function resolveTheme(theme?: ColoredConsoleTheme): Record<LogLevel, StyleOptions> {
    return {
        ...DEFAULT_THEME,
        ...theme
    };
}

const LEVEL_TO_METHOD: Record<LogLevel, keyof ConsoleWriter> = {
    info: 'log',
    success: 'log',
    warn: 'warn',
    error: 'error',
    debug: 'debug'
};

export class ColoredConsole {
    private readonly theme: Record<LogLevel, StyleOptions>;
    private readonly name?: string;
    private readonly enabled: boolean;
    private readonly nameStyle: StyleOptions;
    private readonly writer: ConsoleWriter;

    constructor(options: ColoredConsoleOptions = {}) {
        this.theme = resolveTheme(options.theme);
        this.name = options.name;
        this.enabled = options.enabled ?? detectColorSupport();
        this.nameStyle = options.nameStyle ?? DEFAULT_NAME_STYLE;
        this.writer = {
            log: console.log.bind(console),
            info: console.info?.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console),
            debug: console.debug?.bind(console),
            ...options.writer
        };
    }

    info(message: unknown, ...args: unknown[]): void {
        this.log('info', message, ...args);
    }

    success(message: unknown, ...args: unknown[]): void {
        this.log('success', message, ...args);
    }

    warn(message: unknown, ...args: unknown[]): void {
        this.log('warn', message, ...args);
    }

    error(message: unknown, ...args: unknown[]): void {
        this.log('error', message, ...args);
    }

    debug(message: unknown, ...args: unknown[]): void {
        this.log('debug', message, ...args);
    }

    log(level: LogLevel, message: unknown, ...args: unknown[]): void {
        const methodName = LEVEL_TO_METHOD[level];
        const writerMethod = this.writer[methodName] ?? this.writer.log;
        const label = this.formatLabel(level);
        writerMethod(label, message, ...args);
    }

    private formatLabel(level: LogLevel): string {
        const segments: string[] = [];
        if (this.name) {
            segments.push(applyStyle(`[${this.name}]`, this.nameStyle, { enabled: this.enabled }));
        }

        segments.push(
            applyStyle(level.toUpperCase(), this.theme[level], { enabled: this.enabled })
        );
        return segments.join(' ');
    }
}

export function createColoredConsole(options: ColoredConsoleOptions = {}): ColoredConsole {
    return new ColoredConsole(options);
}

export function colorize(text: string, style: StyleOptions, options?: ColorizeOptions): string {
    return applyStyle(text, style, options);
}

export const ansi = {
    reset: RESET
};
