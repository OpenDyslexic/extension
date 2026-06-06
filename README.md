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

#### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Quick Start
```bash
# Install dependencies
pnpm install

# Build all extensions
pnpm run build

# Run tests
pnpm run test

```
### Installation

```bash
# Install dependencies
pnpm install
```

### Building

```bash
# Build all extensions
pnpm run build
```

### Build outputs

After building, you will have:

- **Unpacked extension folders**
  - `dist/chrome/`
  - `dist/firefox/`
  - `dist/edge/`
- **Packaged zip artifacts**
  - `build/<version>/opendyslexic-chrome-<version>.zip`
  - `build/<version>/opendyslexic-firefox-<version>.zip`
  - `build/<version>/opendyslexic-edge-<version>.zip`

```bash
# Build browser-specific extensions

# Chrome
pnpm run build:chrome

# Firefox
pnpm run build:firefox

# Edge
pnpm run build:edge
```

## 🧪 Testing

### Chrome
To test:

1. Go to: `chrome://extensions`
2. Enable Developer mode
3. Click **Load unpacked**
4. Select `dist/chrome/`

### Firefox
To test:

1. Go to: `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select `dist/firefox/manifest.json`

#### Firefox manifest note (MV2 vs MV3)

Firefox may reject Manifest V3 extensions that use `background.service_worker` with an error like:

`background.service_worker is currently disabled. Add background.scripts.`

To keep development working across Firefox versions/channels, this repo builds Firefox using a **Manifest V2** manifest (`config/firefox-manifest.json`), which uses `background.scripts`.

Need more information about Chrome Extension Development? Please visit [Google Chrome Extension Development](http://developer.chrome.com/extensions/devguide.html).

### Edge
To test:

1. Go to: `edge://extensions`
2. Enable Developer mode
3. Click **Load unpacked**
4. Select `dist/edge/`

## ❓ Questions

For questions and support, please visit the GitHub issues tab.

## ⭐ Sponsors

## 📜 License

MIT Copyright (c) 2013-present
