# Developer Notes — cw.helper.colored.console

> Bu dosya Codex için hazırlandı. Yeni sohbet açıldığında bu paketle ilgili tüm önemli noktaları hızlıca hatırlamak için referans olarak kullan.

## Genel Bakış
- `cw.helper.colored.console`: ANSI renkli logging yardımcıları; `console` üzerinde tema, etiket ve yazıcı özelleştirmesi sunar.
- Sıfır runtime bağımlılığı; TypeScript ile yazıldı, ESM olarak yayımlanır.
- Hedef Node.js >= 18; terminalde ANSI desteği varsayılır.
- Paket API’sı `createColoredConsole`, `ColoredConsole` sınıfı, `colorize`, `applyStyle`, `detectColorSupport` ve `ansi` yardımcılarını içerir.

## Mimari & Kod Yapısı
- Ana mantık `src/colorConsole.ts` dosyasında toplanır.
  - `DEFAULT_THEME` (info/success/warn/error/debug) varsayılan renkleri tanımlar.
  - `ColoredConsole` sınıfı: `name`, `nameStyle`, `theme`, `enabled`, `writer` seçenekleri.
  - `detectColorSupport()`: `NO_COLOR`, `FORCE_COLOR`, `process.stdout.isTTY` kontrolü.
  - `ConsoleWriter`: custom loglayıcılar eklenebilir; eksik methodlar `log`’a düşer.
  - `createColoredConsole`: sınıfı saran fabrika fonksiyonu.
  - `colorize` / `applyStyle`: bağımsız string renklendirme yardımcıları.
- `src/index.ts`: tüm tipleri/yardımcıları `.js` uzantısı kullanarak re-export eder (ESM uyumluluğu).

## Build & Tooling
- **ESM Only**: `package.json` → `type: "module"`, exports haritası sadece `import` alanını listeler.
- TypeScript
  - `tsconfig.json`: `moduleResolution: "Bundler"`, test kaynaklarını da içerir.
  - `tsconfig.build.json`: sadece `src/` derlenir, `declaration` + `declarationMap` üretir.
- Jest
  - Konfig: `jest.config.cjs` (`ts-jest/presets/default-esm`, `extensionsToTreatAsEsm`, mapper vb.).
  - Testler `tests/` altında; `@jest/globals` import edilerek `jest.fn()` kullanılır.
- Lint & Format: ESLint flat config (`eslint.config.mjs`), Prettier (`.prettierrc.json`).
- Git Hook: `.githooks/pre-commit` format → `git add --all` → lint → coverage (>=90%).
  - Kurulum: `npm run hooks:install` (`scripts/setup-hooks.cjs`).

## Otomasyon Scriptleri
- `npm run build` → `tsc -p tsconfig.build.json`.
- `npm run test` / `test:coverage` (`--experimental-vm-modules` ile Jest).
- `npm run lint`, `npm run format`, `npm run format:check`.
- `prepare`: build + hook install (npm install sırasında çalışır).
- `prepublishOnly`: build + `node scripts/smoke.mjs` (public exportların sağlığı).
- `release`: `scripts/release.mjs` → `npm version` + `git push` + `git push --tags`.

### Smoke Test (`scripts/smoke.mjs`)
- `dist/index.js` içinden `createColoredConsole` ve `applyStyle` fonksiyonlarının varlığını doğrular.

### Release Script (`scripts/release.mjs`)
- Argümanlar: semver bump türü (`major`/`minor`/`patch`/`pre*`), opsiyonel commit mesajı.
- Mesajda `%s` yoksa otomatik ekler, varsayılan `chore: release v%s`.
- Sonrasında otomatik `git push` ve `git push --tags`.

## Sürüm & Dokümantasyon Kuralları
- **Sürümleme**: Semver kullan. Public API değişmezse `patch`, yeni özellikler için `minor`, breaking değişiklikler için `major`.
- **Doküman Güncellemeleri**: Her değişiklikte aşağıdakileri değerlendir:
  1. `README.md` – yeni özellikler/apiler vs. için güncelle.
  2. `DEV_NOTES.md` – geliştirici notları, kurallar, workflow değişiklikleri.
  3. `CHANGE_LOG.md` – kullanıcıya dönük değişiklik listesi. Yeni sürüm notu ekle.
- **Release Prosesi**: Versiyon bump + changelog + git tag. `npm run release -- <type>` komutunu tercih et (kod temiz olmalı).
  - 2025-09-19 notu: `1.1.0` etiketi yanlışlıkla `minor` bump ile üretildi (içerik `1.0.0` ile aynı). Komutu çalıştırmadan önce bump türünü iki kez kontrol et.
- **Yayınlama**: `npm publish` öncesi `prepublishOnly` otomatik smoke test çalıştırır.
- **Conventional Commits**: `chore: release vX.Y.Z`, `feat:`, `fix:` vb. formatları koru.

## Paket Metadata
- `package.json` → `keywords`, `author`, `license: MIT`, `publishConfig.provenance: true`, `sideEffects: false`, `engines.node: ">=18"`.
- `files`: `dist`, `README.md`, `LICENSE`.
- Repo bilgisi: `git+https://github.com/mkurak/cw.helper.colored.console.git`.

## Test Notları
- `tests/logger.test.ts`: ESM uyumlu `@jest/globals` importuna dikkat.
- `tests/detect.test.ts`: `process.env` ve `process.stdout` mock’ları ile renk tespit senaryolarını test eder.
- `tests/colorize.test.ts`: `applyStyle` ve `colorize` fonksiyonunun kombinasyonlarını kapsar.
- `tests/index.test.ts`: public API yüzeyini doğrular.

## README Özeti
- Kurulum, hızlı başlangıç, API referansı, tema/renk özelleştirme örnekleri, yazıcı adaptasyonları, tooling, release süreci, katkı rehberi, lisans.
- README’nin giriş bölümündeki madde işaretlerinde `>=` sembolünü matematik karakteri yerine ASCII `>=` olarak kullandık (tespit: 2025-09-19).

## Pending / Gelecek Fikirler
- ANSI kod tabloları ve geniş tema örnekleri için ek dokümantasyon.
- Dışa dönük CLI aracı ya da color profile presetleri.
- Gelişmiş writer adaptörleri (ör. Pino/Logfmt encoder) için ayrı helper paketleri.

---
Bu notlar her yeni düzenlemede güncellenmeli. Release, dokümantasyon veya otomasyon kurallarında değişiklik olduğunda ilk olarak buraya işle.
