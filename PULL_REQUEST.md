# Dependency cleanup, toolchain modernisation, and a translation overhaul

## Summary

Three related pieces of work:

1. **Dependencies** — 33 declared packages down to 17, and `npm audit` from 17 vulnerabilities (4 critical) to **zero**.
2. **Build** — Babel removed entirely, the deprecated `raw-loader` replaced with a webpack built-in, and all three browser targets now compile **warning-free**.
3. **Translations** — the 9 keys that were missing from every non-English locale are filled in, and the pre-existing machine translations of every _live_ key have been corrected across all 57 locales.

No user-facing feature changes. The popup gains a rebuilt toast component that behaves like the old one.

---

## 1. Dependencies

**12 packages removed.** Six were entirely unreferenced (`archiver`, `html2canvas`, `toastify-js`, `ts-jest`, `file-loader`, `@vue/vue3-jest` — the last two backed dead webpack rules and a Jest transform that was never configured).

**The Google Translate tooling is gone** (`tools/translate/`, the 8 `translate:*` scripts, and `google-translate` + `get-json` + `traverse` + `yargs`). It was the sole source of all four critical advisories, via the deprecated `request@2.88.0` and `underscore@1.9.1`. `google-translate@3.0.0` ships **identical** dependencies to v2, so updating could never have fixed it. Replaced by [`TRANSLATING.md`](./TRANSLATING.md), which documents the message format and provides a ready-made LLM prompt.

**`async` was a phantom dependency** — `tools/translate/` required it without declaring it; it only resolved because `archiver` happened to hoist it. Removed along with its consumer.

**Everything else updated to latest:** Jest 30, `css-loader` 7, `style-loader` 4, `postcss-loader` 8, `copy-webpack-plugin` 14, `webpack-cli` 7, Tailwind 4.3.3, Vue 3.5.40.

Two packages are deliberately **not** on latest, because latest breaks the build:

- **Babel 8** is ESM-only and `babel-jest` still `require()`s `@babel/core` → `ERR_REQUIRE_ESM`. Moot now (see below), but documented.
- **yargs 18** is ESM-only and would have broken `tools/translate/index.js`. Also moot.

### `overrides`

Three entries, all cleaning up Jest's own transitive tree. Together they take `npm install` from six deprecation warnings to one and cut ~50 packages.

| Override                  | Why                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brace-expansion: ^5.0.8` | Jest pulls a version with two DoS advisories. npm's suggested fix is a destructive major downgrade elsewhere. Removing this reintroduces **19** high-severity advisories. |
| `test-exclude: ^7.0.1`    | `babel-plugin-istanbul` still asks for v6, which drags in `glob@7` and the abandoned, memory-leaking `inflight`.                                                          |
| `glob: ^13.0.6`           | Jest asks for `^10.5.0`; that maintainer deprecates every trailing version, so 10 _and_ 11 both warn.                                                                     |

### One warning left, deliberately

`whatwg-encoding`, via `jest-environment-jsdom` → `jsdom@26`. **Do not try to fix this by overriding `jsdom`.** I tried: `jsdom@30` does drop the package and the install looks clean, but `jest-environment-jsdom` pins `jsdom@^26`, and 30 swaps in `@exodus/bytes` — which is ESM-only while `html-encoding-sniffer` loads it with `require()`. Every test suite fails with `ERR_REQUIRE_ESM`. It clears itself when `jest-environment-jsdom` bumps its own range.

### Node

`engines.node` is now `>=22.11.0` and CI moves from Node 20 to 22. The strictest dependency (`webpack-cli`) only needs 20.9, but Node 20 reached end-of-life in April 2026.

---

## 2. Build

### Babel removed entirely

`webpack.config.js` passed `presets: ['@babel/preset-env']` with **no targets and no `browserslist` anywhere**, which makes preset-env transpile to ES5 — for a Manifest V3 extension that requires Chrome 88+ and sets `strict_min_version: 114` for Firefox. The source only uses arrow functions, `async` and spread. Nothing needed transpiling.

`babel-jest` was then the only remaining reason Babel existed, since Jest needs ESM→CJS (tests use `import`, package is not `"type": "module"`). Swapped for **`@swc/jest`**: 80 `@babel/*` packages replaced by 3, and the test run roughly halved (0.65s → 0.33s). `babel.config.js` deleted.

> `@babel/core` still appears in `node_modules` as a transitive — `@jest/transform` and `jest-config` depend on it directly. It is no longer a declared dependency.

### `raw-loader` → `asset/source`

`raw-loader` is deprecated. `engine.js` needs the OpenDyslexic stylesheet as a _string_ to inject into pages, so the two `.css` rules are now split on `resourceQuery`: `?raw` yields text via webpack's built-in `asset/source`, everything else goes through PostCSS. Verified the embedded stylesheet is complete — 4 `@font-face`, 7 `font-family`, 4 `url()`, 7 `font-weight` and all 4 `{{$browser_extension_protocol}}` placeholders match the source file exactly.

⚠️ Keep the `resourceQuery: { not: [/raw/] }` guard on the second rule, or the raw import gets processed as a stylesheet.

### Warning-free builds

Store screenshots moved out of `app/` to `store/screenshots/`, so they are no longer bundled into the shipped zip. That left webpack flagging _its own output zip_ as an oversized web asset, which is a false positive — a `performance.assetFilter` now excludes `.zip`, so real bundle regressions stay visible.

### Size impact

| Artefact           | Before      | After         |               |
| ------------------ | ----------- | ------------- | ------------- |
| `background.js`    | 5,544 B     | **1,479 B**   | −73%          |
| `engine.js`        | 13,510 B    | 13,471 B      | ~0            |
| `popup.js`         | 145,742 B   | 159,872 B     | **+14,130 B** |
| Packaged `.zip`    | 2,200,516 B | **468,238 B** | −79%          |
| Declared deps      | 33          | **17**        |               |
| Installed packages | 1,020       | **493**       |               |

`background.js` shrank by three quarters because Babel was injecting async-to-generator helpers for `async` functions the target browsers support natively.

**`popup.js` grew, and that is a real trade-off, not a win.** Replacing `@meforma/vue-toaster` with daisyUI classes pulls 7 new CSS rule blocks (`.toast`, `.toast-bottom`, `.toast-center`, `.alert` + 3 variants) into the bundle, since `style-loader` inlines CSS. That outweighs what dropping transpilation saved. The zip is still 79% smaller overall because of the screenshot move.

---

## 3. Toast component

`@meforma/vue-toaster` was last published ~5 years ago and was the only reason `stylus` and `stylus-loader` were in the build — its SFC uses `<style lang="stylus">`. Replaced with a small daisyUI toast driven by local component state; all five call sites already funnelled through one `toaster()` method, so that was the only swap point.

Behaviour matches the old configuration: bottom-centre, fully rounded, single toast at a time, 3000 ms auto-dismiss. Verified in a browser with a stubbed extension API — appears immediately, dismisses at exactly 3000 ms, and three rapid clicks yield exactly one toast.

**`success` maps to `alert-info`, not `alert-success`, on purpose.** The popup sits on green `#55b685` (`app/assets/styles/app.css`), so a green toast disappears into the background. The original code did the same thing via `$toast.info` — I initially "corrected" it to semantic colours and reintroduced the bug. Measured contrast (resolving `oklch` through a canvas): text-in-pill is **6.34:1** for info, 5.24 warning, 5.48 error — all above WCAG AA 4.5:1.

---

## 4. Translations

### Missing keys filled in

`en` had 58 keys; every other locale had 49. Nine keys from the excluded-sites feature and the accessibility labels were untranslated **everywhere**, so those strings fell back to English in all 57 locales. Now complete — **513 new entries, zero deletions**, inserted in matching key order with `description` fields left in English and `placeholders` blocks copied verbatim.

### Three errors fixed in the English source

These would have propagated into every translation:

- `followRobertJamesToolTip`: "Mainted by" → "Maintained by"
- `created_by`: "OpenDyslexic was created Abbie Gonzalez" → "created **by** Abbie Gonzalez"
- `bugs`: "Report Bugs on Discords" → "Report bugs on Discord"

### Existing translations corrected — 591 strings

**Only 28 of the 58 keys are actually referenced** by the code or manifests; the other 30 are leftovers from an earlier popup. I corrected the live ones and left the dead ones alone. What the old automated script had got wrong:

- **`On`/`Off` were prepositions in 26+ locales** — translated by dictionary sense rather than by their role as toggle states. French "Sur", Japanese "の上" (_on top of_), Chinese "离开" (_leave_), Korean "~에" (a grammatical particle), Serbian "Он" (_he_).
- **34 locales lost at least one brand name.** Serbian was worst — its entire file was transliterated English, including **"Цхроме" for "Chrome"**, a letter-by-letter transliteration that reads nothing like the product. Fully rewritten.
- **Tense and part-of-speech drift** on "Settings Applied": Welsh read "Gosodiadau Cymhwysol" (_applicable settings_); Korean and German were noun phrases.

Product names (`OpenDyslexic`, `Chrome`, `Firefox`, `Edge`, `Github`, `Discord`, `Helperbird`, `X`) and credited people (`Abbie Gonzalez`, `Robert James Gabriel`) now stay in Latin script everywhere, with each language's grammatical particles attached around them.

### Manifest versions aligned

`chrome-manifest.json` was 2026.7.28 while Firefox and Edge were still 2026.4.28. All three now match, so the release zips share one version.

---

## 5. Docs

- **`TRANSLATING.md`** (new) — message format, placeholder rules, a copy-paste LLM prompt for new locales, a completeness check command, which keys are live, and the specific traps the old automated translations fell into.
- **`README.md`** — added build commands, a dependency-update workflow, and a "Deliberate choices" section explaining why there is no Babel, why the `resourceQuery` guard matters, what each `overrides` entry is for, and why not to override `jsdom`.

---

## Verification

From a clean `rm -rf node_modules && npm ci`:

- ✅ **0 vulnerabilities** (from 17, 4 critical)
- ✅ **1 deprecation warning** (from 6; the remaining one is unfixable upstream)
- ✅ **75/75 tests pass**; coverage unchanged at 93.23% / 77.88% / 97.14% / 95.31%
- ✅ All three targets compile **with zero warnings**
- ✅ All 58 locales complete and structurally identical; brand names, `$FONT$`/`$SITE$` placeholders and key order verified programmatically
- ✅ Popup driven in a browser with a stubbed extension API: storage load, placeholder substitution, screen-reader labels, and add/duplicate/remove toasts all correct in English, French, Arabic, Serbian, German, Chinese, Korean and Turkish

> **Note on coverage:** `npm test` alone does **not** exercise `test-exclude` or `glob`. If you touch those overrides, run `npm run test -- --coverage`.

## Notes for the reviewer

- `tests/content/zz_probe.test.js` was already deleted in the working tree before this work started; it is unrelated to these changes.
- The 30 unreferenced message keys are left in place rather than deleted — removing them is a separate call, and worth considering since it would halve the translation surface.
- Popup layout does not mirror for RTL locales (`index.html` has no `dir` attribute), so Arabic, Hebrew and Persian render correct text in an LTR layout. Pre-existing and out of scope here; usually solved with `@@bidi_dir`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
