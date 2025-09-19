# Developer Notes — cw.helper.colored.console

> Reference cheat sheet for future sessions when the context window is limited.

## Overview
- `cw.helper.colored.console` provides ANSI-aware logging helpers with themes, label prefixes, and extensible writers.
- Zero runtime dependencies; authored in TypeScript and published as pure ESM.
- Requires Node.js 18+ and a terminal that supports ANSI escape codes.
- Public API exports: `createColoredConsole`, `ColoredConsole`, `colorize`, `applyStyle`, `detectColorSupport`, `ansi`, plus the related types (`ColorName`, `ColoredConsoleOptions`, etc.).

## Architecture & Code Layout
- Core logic resides in `src/colorConsole.ts`:
  - `DEFAULT_THEME` defines defaults for `info`, `success`, `warn`, `error`, and `debug` levels.
  - `ColoredConsole` manages themes, name labels, enable flags, and custom writers.
  - `detectColorSupport()` honours `NO_COLOR`, `FORCE_COLOR`, and `process.stdout.isTTY`.
  - `ConsoleWriter` allows pluggable transports; undefined writer methods fall back to `log`.
  - `createColoredConsole` wraps instantiation; `colorize`/`applyStyle` provide standalone styling helpers.
- `src/index.ts` re-exports helpers and types using `.js` extensions for runtime ESM compatibility.

## Build & Tooling
- ESM only (`package.json` sets `type: "module"` and establishes an exports map with import/types entries).
- TypeScript
  - `tsconfig.json`: `moduleResolution: "Bundler"`, includes `src` and `tests`, emits source maps.
  - `tsconfig.build.json`: compiles only `src/`, emits declarations and maps to `dist/`.
- Jest
  - Configured via `jest.config.cjs` using `ts-jest/presets/default-esm`, `extensionsToTreatAsEsm`, and a `.js` extension mapper.
  - Tests import from `@jest/globals` to access `jest.fn()` in ESM mode.
- ESLint + Prettier:
  - Flat config (`eslint.config.mjs`) combines `@eslint/js`, `typescript-eslint`, and `eslint-plugin-prettier` enforcing Prettier as an error.
  - `.prettierrc.json` sets `singleQuote`, `semi`, `trailingComma: "none"`, `printWidth: 100`, `tabWidth: 4`.
- Git hooks:
  - `.githooks/pre-commit` runs format → `git add --all` → lint → `npm run test:coverage` (threshold ≥90%).
  - `scripts/setup-hooks.cjs` sets the repo hook path; invoked via `npm run hooks:install` and `npm run prepare`.

## Automation Scripts
- `npm run build` → `tsc -p tsconfig.build.json`.
- `npm run test` / `npm run test:coverage` → Jest in ESM mode (Node `--experimental-vm-modules`).
- `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`.
- `npm run prepare` → build + hook install (executes automatically on `npm install`).
- `npm run prepublishOnly` → build + smoke test before publishing.
- `npm run release` → wraps `npm version`, pushes commits and tags.

### Smoke Test (`scripts/smoke.mjs`)
- Imports the built bundle and ensures `createColoredConsole`/`applyStyle` exports exist.

### Release Script (`scripts/release.mjs`)
- Accepts semver bump arguments (`major`, `minor`, `patch`, `pre*`) plus optional commit messages.
- Default commit message is `chore: release v%s`; `%s` is appended automatically when omitted.
- Runs `npm version`, then `git push` and `git push --tags`.

## Versioning & Documentation Rules
- Follow semver: `patch` for fixes, `minor` for new backwards-compatible features, `major` for breaking changes.
- When code changes:
  1. Update `README.md` to reflect API or workflow adjustments.
  2. Update `DEV_NOTES.md` to capture internal instructions and rules.
  3. Update `CHANGE_LOG.md` with user-facing notes.
- Release process: version bump + changelog + tagged commit via `npm run release -- <type>` (ensure a clean working tree first).
  - 2025-09-19 note: version `1.1.0` was published by mistake using a minor bump; it is identical to `1.0.0`. Double-check bump types before running the release script.
- Publishing: `npm publish` triggers `prepublishOnly`, which compiles and runs the smoke test.
- Use Conventional Commits (`feat:`, `fix:`, `chore: release vX.Y.Z`, etc.).

## Package Metadata
- `package.json` includes keywords, MIT license, provenance-enabled publish config, `sideEffects: false`, and `engines.node: ">=18"`.
- Distributed files: `dist/`, `README.md`, `LICENSE`.
- Repository URL: `git+https://github.com/mkurak/cw.helper.colored.console.git`.

## Testing Notes
- `tests/logger.test.ts`: spies on custom writers with `@jest/globals`.
- `tests/detect.test.ts`: exercises environment/TTY detection branches.
- `tests/colorize.test.ts`: validates styling combinations and disabled paths.
- `tests/index.test.ts`: guards the public export surface.

## README Highlights
- Covers installation, quick start, full API reference, theming, custom writers, usage patterns, tooling scripts, release workflow, contributing guidelines, and licensing.
- Bullet points use ASCII operators such as `>=` for consistency.

## Future Ideas
- Extend documentation with ANSI code tables and themed presets.
- Optionally ship CLI helpers or pre-defined color profiles.
- Explore wrappers for structured loggers (Pino, logfmt) as separate helper packages.

---
Keep this document updated alongside releases, documentation changes, and automation tweaks.
