<p align="center">
  <a href="https://wwww.opendyslexic.org" target="_blank" rel="noopener noreferrer">
    <img width="750" src="./app/assets/images/readme.png" alt="OpenDyslexic logo">
  </a>
</p>

## 🚀 Introduction

Open-Dyslexic is an open-source font designed to improve readability for readers with dyslexia. This browser extension overrides all fonts on webpages with the OpenDyslexic font and formats pages to be more easily readable.

## 🧩 Extensions

-   [Chrome](https://chrome.google.com/webstore/detail/opendyslexic-for-chrome/cdnapgfjopgaggbmfgbiinmmbdcglnam)
-   [Firefox](https://addons.mozilla.org/firefox/addon/opendyslexic-for-firefox/)
-   [Edge](https://microsoftedge.microsoft.com/addons/detail/opendyslexic/)

## 🤝 Support

OpenDyslexic for Chrome is an MIT-licensed open-source project, and its ongoing development is made possible entirely by the support of these awesome backers. If you'd like to join them, please consider:

-   [Become a backer on GitHub](https://github.com/sponsors/RobertJGabriel)
-   [Become a backer or sponsor on Patreon](https://patreon.com/opendyslexic).

### What's the difference between Patreon and GitHub?

Funds donated via GitHub go directly to support Robert James' full-time work on the OpenDyslexic extension.

Funds donated via Patreon will be used to compensate work and expenses for Abbie's work on the font.

Your name/logo will receive proper recognition and exposure by donating on either platform.

## 🙌 Contribution

### Getting Started

Requires **Node 22.11 or newer** (the build toolchain sets this floor, and CI runs Node 22).

```bash
# Install
npm install

# Build (Chrome, into ./dist)
npm run build

# Run tests
npm run test

```

### Build commands

```bash
# Build one browser into ./dist
npm run chrome
npm run firefox
npm run edge

# Build all three and write zips to ./build/<browser>/<version>/
npm run package

# Remove ./dist and ./build
npm run clean

# Format the codebase
npm run format
```

The version in the zip filename comes from the `version` field of the manifest in `config/`. Keep `chrome-manifest.json`, `firefox-manifest.json`, and `edge-manifest.json` on the same version when you cut a release.

## 🔄 Updating dependencies

```bash
# See what's behind
npm outdated

# Apply everything in range (patch + minor)
npm update

# Move a single package to its newest major
npm install --save-dev <package>@latest
```

After **any** dependency change, run the full check — the unit tests alone will not catch a broken loader or a bundling regression:

```bash
npm run test && npm run package && npm audit
```

All three browser builds must compile and the 75 tests must pass. The build should be completely warning-free — if webpack starts reporting asset-size hints, something real got large.

Store listing screenshots live in `store/screenshots/`, deliberately outside `app/`, so they are never bundled into the shipped zip.

### Deliberate choices

Please don't "fix" these without checking the build:

-   **There is no Babel, and the bundle is not transpiled.** Manifest V3 requires Chrome 88+, and the Firefox manifest sets `strict_min_version` to 114. The source only uses arrow functions, `async`, and spread — all supported well below those floors — so webpack ships the syntax as written. Adding `babel-loader` back inflated `background.js` from 1.4 KB to 5.5 KB with async-to-generator helpers those browsers don't need. If you ever need a lower floor, add a `browserslist` key rather than reintroducing a blanket ES5 transpile.
-   **Jest transforms with `@swc/jest`, not `babel-jest`.** Its only job is turning the source's ESM into CJS, because the test files use `import` and the package is not `"type": "module"`. This replaced 80 `@babel/*` packages with three, and cut the test run roughly in half.
-   **`?raw` CSS imports use webpack's built-in `asset/source`.** `app/scripts/content/engine.js` needs the OpenDyslexic stylesheet as a string to inject into pages. The two `.css` rules in `webpack.config.js` are split on `resourceQuery` so `?raw` yields text while every other stylesheet goes through PostCSS. This replaced the deprecated `raw-loader`; keep the `resourceQuery: { not: [/raw/] }` guard or the raw import will be processed as a stylesheet instead.
-   **`engines.node` is `>=22.11.0`.** The strictest dependency (`webpack-cli`) only needs Node 20.9, but Node 20 went end-of-life in April 2026, so the project targets 22. `.github/workflows/release.yml` matches this — bump both together.

### The `overrides` block

Every entry exists to clean up Jest's own transitive tree. None of these are our direct dependencies, so the only lever is `overrides`. Re-run `npm run test -- --coverage` after touching any of them — plain `npm test` does **not** exercise `test-exclude` or `glob`.

-   **`brace-expansion: ^5.0.8`** — Jest pulls a version with two DoS advisories. npm's suggested fix is a destructive major downgrade elsewhere; this forces the patched release, which is dual-published so CommonJS consumers still work. Removing it reintroduces 19 high-severity advisories.
-   **`test-exclude: ^7.0.1`** — `babel-plugin-istanbul` still asks for `test-exclude@^6`, which drags in `glob@7` and the abandoned, memory-leaking `inflight`. Version 7 moved to `glob@^10`, so this drops both.
-   **`glob: ^13.0.6`** — Jest asks for `glob@^10.5.0`, and that package's maintainer deprecates every trailing version, so 10 _and_ 11 both warn on install. 13 is current and satisfies Node 22.

Together these take `npm install` from six deprecation warnings to one and cut about 50 packages.

### Known-unfixable warning

`npm install` still prints one deprecation for **`whatwg-encoding`**, reached via `jest-environment-jsdom` → `jsdom@26`. It is cosmetic — `npm audit` stays at zero.

Do **not** try to fix it by overriding `jsdom`. `jsdom@30` does drop the package, but `jest-environment-jsdom` pins `jsdom@^26`, and forcing 30 replaces it with `@exodus/bytes` — which is ESM-only, while `html-encoding-sniffer` loads it via `require()`. That fails every test suite with `ERR_REQUIRE_ESM`. The warning goes away on its own when `jest-environment-jsdom` bumps its own `jsdom` range.

Keep `npm audit` at zero. If a new dependency drags in advisories that its maintainer won't fix, prefer dropping the dependency over living with them — that is how the Google Translate tooling was removed.

## 🧪 Testing

To test, go to: `chrome://extensions`, enable Developer mode, and load the app as an unpacked extension.

Need more information about Chrome Extension Development? Please visit [Google Chrome Extension Development](http://developer.chrome.com/extensions/devguide.html).

## 🌍 Translations

The extension ships in 58 languages. English is the source of truth and every other locale is a translation of it.

See **[TRANSLATING.md](./TRANSLATING.md)** for the file format and a ready-made prompt you can paste into an LLM to translate a new locale.

## ❓ Questions

For questions and support, please visit the GitHub issues tab.

## ⭐ Sponsors

## 📜 License

MIT Copyright (c) 2013-present
