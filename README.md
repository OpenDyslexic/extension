# opendyslexic-chrome [**Chrome** extension][link-cws] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/cdnapgfjopgaggbmfgbiinmmbdcglnam.svg?label=%20">][link-cws] <span class="badge-patreon"><a href="https://www.patreon.com/RobertJGabriel" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
> Open-Dyslexic is an open sourced font created to increase readability for readers with dyslexia. This extension overrides all fonts on webpages with the OpenDyslexic font, and formats pages to be more easily readable. 

<img src="./github/readme.png" width="752">

## Installation

**Prerequisites:** [Node](http://nodejs.org/) and the following global node modules:  gulp (if you have none of these modules, just run npm run global-deps).
- Clone this repo locally ``` git clone  https://github.com/antijingoist/opendyslexic-chrome```
- Open up either terimal or CMD
- Naviagte to the repo 
- Run the following command inside the repo ```npm install```
- Then run ```gulp ```, which build all javascript and css.


### Setup

- See set up first
- Open up Google chrome
- Go the Google Chrome Settings
- Go to extensions
- Click enable developer mode.
- Load unpackaged extensions.
- Pick the opendyslexic-chrome folder.


### Build Files

- Open up command line or termial
- Naviagate to the opendyslexic-chrome folder
- Run ```npm install ```
- Then ``` gulp ```
- This will create a folder called dist and compress all css, and javascript :)


### Important Notes

- system.js handles the turning on and off of the font on the page
- core.js handles the button click using angler.js

## Screenshots

### Before

![Display of icon for chrome](https://github.com/antijingoist/opendyslexic-chrome/blob/master/.github/images/before.png)

### After

![Display of icon for chrome](https://github.com/antijingoist/opendyslexic-chrome/blob/master/.github/images/after.png)

### License

MIT © [Robert James Gabriel](https://www.robertgabriel.ninja)

[npm-image]: https://badge.fury.io/js/opendyslexic-chrome.svg
[npm-url]: https://npmjs.org/package/opendyslexic-chrome
[travis-image]: https://travis-ci.org/antijingoist/opendyslexic-chrome.svg?branch=master
[travis-url]: https://www.travis-ci.com/antijingoist/opendyslexic-chrome
[link-cws]: https://chrome.google.com/webstore/detail/opendyslexic/cdnapgfjopgaggbmfgbiinmmbdcglnam/support?hl=en "Version published on Chrome Web Store"