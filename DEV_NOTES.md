# Developer Notes — cw.helper.colored.console

> Reference cheat sheet for future sessions when the context window is limited.

## Overview
- `cw.helper.colored.console` offers ANSI-aware logging helpers with theming, label prefixes, and pluggable writers.
- Zero runtime dependencies; built with TypeScript and shipped as pure ESM.
- Targets Node.js 18+ with terminals that support ANSI escape codes.
- Public API surface exports: `createColoredConsole`, `ColoredConsole`, `colorize`, `applyStyle`, `detectColorSupport`, `ansi`, plus the relevant TypeScript types.

## Architecture & Layout
- Core logic lives in `src/colorConsole.ts`:
  - `DEFAULT_THEME` defines base styles for `info`, `success`, `warn`, `error`, and `debug` levels.
  - `ColoredConsole` manages themes, optional name labels, enabled flags, and custom writers.
  - `detectColorSupport()` respects `NO_COLOR`, `FORCE_COLOR`, and `process.stdout.isTTY`.
  - `ConsoleWriter` describes the writer contract; missing level-specific methods fall back to `log`.
  - `createColoredConsole` wraps the class, while `colorize`/`applyStyle` provide standalone styling helpers.
- `src/index.ts` re-exports helpers and types using `.js` extensions to preserve runtime ESM compatibility.
- `src/themes/cw.ts` provides the shared cw theme (`cwTheme`) and `createCwLogger` factory for downstream packages.

## Tooling
- ESM-only distribution (`package.json` sets `type: "module"`; exports map exposes `import` + `types`).
- TypeScript configs:
  - `tsconfig.json`: `moduleResolution: "Bundler"`, includes both `src` and `tests`, emits source maps.
  - `tsconfig.build.json`: compiles only `src/`, emits declarations and declaration maps to `dist/`.
- Jest configuration (`jest.config.cjs`) relies on `ts-jest/presets/default-esm`, `extensionsToTreatAsEsm`, and a regex mapper for `.js` extensions.
- ESLint + Prettier:
  - Flat config (`eslint.config.mjs`) combining `@eslint/js`, `typescript-eslint`, and `eslint-plugin-prettier`.
  - `.prettierrc.json` enforces single quotes, semicolons, `tabWidth: 4`, and `printWidth: 100`.
- Git hooks:
  - `.githooks/pre-commit` runs format → `git add --all` → lint → `npm run test:coverage` (targets ≥90% coverage thresholds).
  - `scripts/setup-hooks.cjs` sets `core.hooksPath`, called by `npm run hooks:install` and `npm run prepare`.

## NPM Scripts
- `npm run build` — `tsc -p tsconfig.build.json`.
- `npm run test` — Jest via Node `--experimental-vm-modules`.
- `npm run test:coverage` — same with coverage thresholds (90/90/90/80).
- `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`.
- `npm run prepare` — build + hook install (fires on `npm install`).
- `npm run prepublishOnly` — build + smoke test before publish.
- `npm version <type>` — bumps the version and creates a commit/tag (run `git push --follow-tags` afterwards).

### Smoke Test (`scripts/smoke.mjs`)
- Imports the published bundle and asserts `createColoredConsole` / `applyStyle` exist before publishing.

## Versioning & Documentation Rules
- Follow semver: `patch` for fixes, `minor` for additive but backward-compatible changes, `major` for breaking updates.
- When shipping changes:
  1. Update `README.md` for user-facing docs.
  2. Update `DEV_NOTES.md` with developer-facing context.
  3. Update `CHANGE_LOG.md` with user-visible highlights.
- Release sequence: ensure clean git state → `npm version <type>` → `git push --follow-tags`.
  - 2025-09-19 note: `1.1.0` was published accidentally as a minor bump but matches `1.0.0`; double-check the requested bump before tagging.
- `prepublishOnly` re-builds and runs the smoke test ahead of `npm publish`.
- Follow Conventional Commits (e.g., `feat:` / `fix:` / `chore: release vX.Y.Z`).

## Metadata
- `package.json` includes keywords, MIT license, provenance-enabled publish config, `sideEffects: false`, `engines.node: ">=18"`.
- Distribution files: `dist/`, `README.md`, `LICENSE`.
- Repository: `git+https://github.com/mkurak/cw.helper.colored.console.git`.

## Testing Notes
- `tests/ansi.test.ts` guards the raw ANSI helper exports.
- `tests/logger.test.ts` spies on writer behaviour with `@jest/globals`.
- `tests/detect.test.ts` covers env-based color detection.
- `tests/colorize.test.ts` validates styling combinations with enabled/disabled flags.
- `tests/index.test.ts` asserts the public API surface.

## README Highlights
- Installation, quick start, API reference, theming, custom writers, usage patterns, tooling scripts, release workflow, contributing guidelines, license.
- Quick start now includes an example console transcript to showcase formatted labels.

## Future Ideas
- Expand documentation with ANSI code tables or ready-made theme presets.
- Provide optional CLI helpers or wrappers for structured loggers (Pino, logfmt, etc.).

---
Keep this document in sync with automation changes, releases, and documentation updates.
