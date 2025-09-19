# cw.helper.colored.console

Minimal yet flexible ANSI-aware logging helpers for **cw** projects. This package wraps `console` with color themes, name labels, and ergonomics that fit both application code and libraries.

- First-class ESM build (Node.js >= 18)
- Zero dependencies at runtime
- Strongly-typed API surface with TypeScript definitions
- Extensible themes and pluggable writers

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Why Another Colored Console Helper?](#why-another-colored-console-helper)
- [Runtime Requirements](#runtime-requirements)
- [Exports](#exports)
- [API Reference](#api-reference)
  - [createColoredConsole](#createcoloredconsole)
  - [ColoredConsole](#coloredconsole)
  - [colorize](#colorize)
  - [applyStyle](#applystyle)
  - [detectColorSupport](#detectcolorsupport)
  - [ansi](#ansi)
  - [Shared Types](#shared-types)
- [Theming & Styles](#theming--styles)
- [Custom Writers](#custom-writers)
- [Color Support Detection](#color-support-detection)
- [Usage Patterns](#usage-patterns)
  - [Per-module Logger](#per-module-logger)
  - [Advanced Theming](#advanced-theming)
  - [Temporarily Disabling Colors](#temporarily-disabling-colors)
  - [Standalone Colorize Helper](#standalone-colorize-helper)
- [Tooling & Scripts](#tooling--scripts)
- [Release Workflow](#release-workflow)
- [Contributing](#contributing)
- [License](#license)

## Installation
```bash
npm install cw.helper.colored.console
# or
pnpm add cw.helper.colored.console
# or
yarn add cw.helper.colored.console
```

## Quick Start
```ts
import { createColoredConsole } from 'cw.helper.colored.console';

const logger = createColoredConsole({
    name: 'api',
    enabled: process.env.NODE_ENV !== 'test'
});

logger.info('Server started', { port: 3000 });
logger.warn('Disk usage high');
logger.error('Unhandled exception', new Error('Database down'));
```

Example terminal output (colors enabled):

```
[api] INFO Server started { port: 3000 }
[api] WARN Disk usage high
[api] ERROR Unhandled exception Error: Database down
```

## Why Another Colored Console Helper?
- Focused on ergonomic logs for Node backends.
- Ships sensible defaults while staying tiny.
- Gives you full control over colors, labels, and transport.
- Plays nicely with modern ESM-only stacks and testing environments.

## Runtime Requirements
- Node.js **18 or newer** (ESM support and `Intl` parity).
- Terminals that understand ANSI escape sequences for color output.

## Exports
```ts
import {
    createColoredConsole,
    createCwLogger,
    ColoredConsole,
    colorize,
    applyStyle,
    detectColorSupport,
    ansi,
    cwTheme,
    type ColoredConsoleOptions,
    type ColoredConsoleTheme,
    type StyleOptions,
    type ColorizeOptions,
    type ColorName,
    type BackgroundName,
    type ConsoleWriter,
    type LogLevel
} from 'cw.helper.colored.console';
```

Subpath exports expose preset themes:

```ts
import { createCwLogger, cwTheme } from 'cw.helper.colored.console/themes/cw';
```

## API Reference

### createColoredConsole
```ts
function createColoredConsole(options?: ColoredConsoleOptions): ColoredConsole;
```
Creates a `ColoredConsole` instance with the provided options. Options are documented in [Shared Types](#shared-types).

### ColoredConsole
Class that wraps console-style logging with ANSI-styled labels.

| Method | Description |
| --- | --- |
| `info(message, ...args)` | Uses the themed `info` level (default cyan). |
| `success(message, ...args)` | Emits success-level logs (default green). |
| `warn(message, ...args)` | Emits warning logs (default yellow, bold). |
| `error(message, ...args)` | Emits error logs (default red, bold). |
| `debug(message, ...args)` | Emits debug logs (default magenta, dim). |
| `log(level, message, ...args)` | Generic entry point when you need dynamic levels. |

Signature mirrors native `console` to keep log pipelines familiar.

### createCwLogger
```ts
function createCwLogger(options?: ColoredConsoleOptions): ColoredConsole;
```
Returns a logger preconfigured with the shared **cw** theme (cyan info, yellow warn, etc.). Provide overrides such as `name`, `writer`, or `enabled` through `options`.

### colorize
```ts
function colorize(text: string, style: StyleOptions, options?: ColorizeOptions): string;
```
Convenience wrapper that delegates to `applyStyle`. Handy for formatting arbitrary strings outside of the logger.

### applyStyle
```ts
function applyStyle(text: string, style?: StyleOptions, options?: ColorizeOptions): string;
```
Builds ANSI escape sequences around `text` when styling is enabled. When `style` is empty or colors are disabled it returns the original string.

### detectColorSupport
```ts
function detectColorSupport(): boolean;
```
Automatically resolves whether colors should be used by inspecting:
1. `NO_COLOR` – disables colors when truthy.
2. `FORCE_COLOR` (≠ `0`) – enables colors regardless of TTY state.
3. `process.stdout.isTTY` – final fallback check.

### ansi
```ts
const ansi = {
    reset: '\u001b[0m'
    // exposes additional escape codes here as the API grows
};
```
Raw escape sequences surfaced for consumers that need low-level control.

### Shared Types
- **ColorName** – keys of the built-in foreground palette (`red`, `greenBright`, `cyan`, ...).
- **BackgroundName** – same palette mapped to background codes.
- **StyleOptions**
  - `color?: ColorName`
  - `background?: BackgroundName`
  - `bold?: boolean`
  - `dim?: boolean`
  - `italic?: boolean`
  - `underline?: boolean`
- **ColorizeOptions**
  - `enabled?: boolean` – bypass detection for manual control.
- **ColoredConsoleTheme** – partial record of `[LogLevel] → StyleOptions`.
- **ColoredConsoleOptions**
  - `name?: string` – label prefix rendered as `[name]`.
  - `nameStyle?: StyleOptions` – overrides `[name]` appearance (default: dim white).
  - `theme?: ColoredConsoleTheme` – override per-level styling.
  - `enabled?: boolean` – explicit color enable/disable flag.
  - `writer?: ConsoleWriter` – plug-in transport (defaults to bound `console`).
- **ConsoleWriter**
  - `log(message: unknown, ...args: unknown[]): void;`
  - Optional `info`, `warn`, `error`, `debug` overrides; fall back to `log` when missing.
- **LogLevel** – `'info' | 'success' | 'warn' | 'error' | 'debug'`.

## Theming & Styles
Default theme:
```ts
const DEFAULT_THEME = {
    info:    { color: 'cyan' },
    success: { color: 'green' },
    warn:    { color: 'yellow', bold: true },
    error:   { color: 'red',   bold: true },
    debug:   { color: 'magenta', dim: true }
};
```
Override selectively:
```ts
const logger = createColoredConsole({
    theme: {
        success: { color: 'blueBright', underline: true },
        debug: { color: 'gray', italic: true }
    }
});
```
Missing keys fall back to the defaults, so you can tweak just the levels you need.

## Custom Writers
Inject a writer when you need structured logging or transport changes:
```ts
import pino from 'pino';
import { createColoredConsole } from 'cw.helper.colored.console';

const stream = pino();
const logger = createColoredConsole({
    enabled: false, // disable ANSI when delegating to JSON logger
    writer: {
        log: (label, message, ...args) => stream.info({ label, args }, message),
        error: (label, message, ...args) => stream.error({ label, args }, message)
    }
});

logger.error('Oops', new Error('boom'));
```
When a writer method is missing (`warn`, `debug`, ...), it automatically falls back to `writer.log`.

## Color Support Detection
- `NO_COLOR` disables styling globally (respects community convention).
- `FORCE_COLOR=1` forces styling (even when piping output).
- If neither variable is set, `detectColorSupport()` falls back to checking `process.stdout.isTTY`.
- `ColoredConsoleOptions.enabled` overrides detection entirely.
- Tests can rely on `@jest/globals` and set `process.env.FORCE_COLOR` to mock colored output (see `/tests/logger.test.ts`).

## Usage Patterns

### Per-module Logger
```ts
import { createColoredConsole } from 'cw.helper.colored.console';

export const logger = createColoredConsole({
    name: 'payments',
    nameStyle: { color: 'blue', bold: true }
});

logger.info('Initializing payment provider');
```

### Advanced Theming
```ts
const logger = createColoredConsole({
    theme: {
        info: { color: 'white', background: 'blue', bold: true },
        debug: { color: 'gray', dim: true },
        error: { color: 'white', background: 'red', bold: true }
    }
});
```

### Temporarily Disabling Colors
```ts
const logger = createColoredConsole({ enabled: true });

logger.warn('Colored');

process.env.NO_COLOR = '1';
logger.warn('Plain text');
```
You can also instantiate with `enabled: false` for deterministic test output.

### Standalone Colorize Helper
```ts
import { colorize } from 'cw.helper.colored.console';

const banner = colorize('[server]', { color: 'greenBright', bold: true }, { enabled: true });
console.log(banner, 'ready');
```

## Tooling & Scripts
This project mirrors the automation used across the **cw** packages:

| Script | Purpose |
| --- | --- |
| `npm run build` | Compile TypeScript from `src/` into ESM output under `dist/`. |
| `npm run test` | Execute Jest in ESM mode (`ts-jest/presets/default-esm`). |
| `npm run test:coverage` | Same tests with coverage thresholds (90/90/90/80). |
| `npm run lint` | Run ESLint over `src/` and `tests/`. |
| `npm run format` | Format sources with Prettier (`tabWidth: 4`). |
| `npm run release` | Version bump + `git push` + tags; see [Release Workflow](#release-workflow). |
| `npm run hooks:install` | Set `.githooks` as the repo hooks directory. |
| `npm run prepare` | Build then install hooks (runs automatically on install). |
| `npm run prepublishOnly` | Build and run smoke tests right before `npm publish`. |

Pre-commit hooks trigger formatting, linting, and coverage gates to keep quality consistent (`.githooks/pre-commit`).

## Release Workflow
1. Decide the semver increment (`patch`, `minor`, `major`, etc.).
2. Run the helper:
   ```bash
   npm run release -- patch "chore: release v%s"
   ```
   - Calls `npm version` with the chosen bump.
   - Commits with a conventional message (substitute `%s` automatically).
   - Pushes commits and tags to origin.
3. CI or local publish can now run `npm publish --access public` (the package is pre-configured with provenance).
4. `prepublishOnly` builds the package and executes `scripts/smoke.mjs`, ensuring public exports stay intact.

## Contributing
- Clone the repository and install dependencies (`npm install`).
- Use Node 18+ and keep `FORCE_COLOR` / `NO_COLOR` in mind when testing.
- Always run `npm run lint && npm run test` before pushing.
- Pre-commit hook is automatically configured via `npm run prepare`; keep it enabled to ensure formatting and coverage standards.
- Follow existing commit message conventions (Conventional Commits).

Feel free to open issues or PRs when you find gaps in the API or documentation.

## License
Released under the [MIT License](./LICENSE).
