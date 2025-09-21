# Changelog

## [1.2.5] - 2025-09-21
### Added
- Added a post-commit hook to auto-tag `package.json` version bumps on the default branch.

## [1.2.4] - 2025-09-21
### Added
- Expanded the smoke test to exercise `colorize` and logger creation, ensuring key exports stay intact.
### Changed
- Documentation clarifies that releases run via `npm version <type>` followed by `git push --follow-tags`.

## [1.2.3] - 2025-09-21
### Changed
- Dropped the npm release helper script and updated docs to route releases through `npm version <type>` + `git push --follow-tags`.

## [1.2.1] - 2025-09-19
### Added
- Expanded `ansi` helper exposing bold/dim/italic/underline plus foreground/background maps for manual styling needs.
- README quick-start now illustrates typical terminal output and clarifies color detection order.
- Additional tests covering the `ansi` export surface.

## [1.2.0] - 2025-09-19
### Added
- Comprehensive README with installation, API reference, theming guidance, tooling overview, and release workflow.
- `DEV_NOTES.md` knowledge base capturing automation rules, release process, and testing expectations for future sessions.
- GitHub Actions workflow (`.github/workflows/publish.yml`) enabling provenance-backed npm publishing.

### Changed
- Converted internal documentation to English for consistency across the workspace.

## [1.1.0] - 2025-09-19
### Note
- Version bump accidentally published as a **minor** release while preparing the initial drop. No code or documentation changes compared to `1.0.0`; use either tag interchangeably. Future work should continue from `1.1.x`.

## [1.0.0] - 2025-09-19
### Added
- Initial public release of `cw.helper.colored.console` with ESM-only distribution and typed API surface.
- `createColoredConsole` factory and `ColoredConsole` class supporting named prefixes, theming, and pluggable writers.
- `applyStyle`/`colorize` helpers with foreground/background colors, bold/dim/italic/underline styling.
- `detectColorSupport` heuristics honoring `NO_COLOR`, `FORCE_COLOR`, and TTY detection.
- Comprehensive Jest test suite covering theming, color detection, and writer fallbacks.
- README documentation outlining installation, API usage, theming patterns, automation scripts, release workflow, and contribution guidelines.

### Tooling
- ESLint (flat config) + Prettier formatting pipeline with pre-commit hook enforcing format → lint → coverage.
- TypeScript build pipeline (`tsconfig.build.json`) emitting declarations/maps under `dist/`.
- Release automation (now documented via `npm version <type>` + `git push --follow-tags`) handling semver bumps, commits, and tag pushes.
- Smoke test script ensuring published bundle exports (`scripts/smoke.mjs`).
