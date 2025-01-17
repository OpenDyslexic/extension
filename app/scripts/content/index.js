import opendyslexic from '!!raw-loader!@styles/core/opendyslexic.css';

let enabled = false;
let currentFont = 'regular';

// Unique ID for our <style> tag
const FONT_ID = 'helperbird-font-styles';
// Body class prefix
const BODY_CLASS_PREFIX = 'helperbird-font-opendyslexic-';

/**
 * Inject or update a style tag with our CSS.
 */
function injectCssInline(id, cssString) {
  let styleTag = document.getElementById(id);
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = id;
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = cssString;
}

/**
 * Remove a style tag by ID.
 */
function removeStyleTag(id) {
  const elem = document.getElementById(id);
  if (elem && elem.parentNode) {
    elem.parentNode.removeChild(elem);
  }
}

/**
 * Put font styles on the page.
 */
function applyFont(fontName) {
  removeStyleTag(FONT_ID);

  const protocol = chrome.runtime.getURL('');
  let cssString = opendyslexic.toString();
  // Replace placeholders with actual extension protocol
  cssString = cssString.replace(/{{\$browser_extension_protocol}}/g, protocol);

  // Insert updated CSS
  injectCssInline(FONT_ID, cssString);

  // Remove any old body classes first
  document.body.classList.forEach((className) => {
    if (className.startsWith(BODY_CLASS_PREFIX)) {
      document.body.classList.remove(className);
    }
  });

  // Add a single class to the body
  const className = BODY_CLASS_PREFIX + fontName.toLowerCase();
  document.body.classList.add(className);
}

/**
 * Remove all font classes and styles.
 */
function removeFont() {
  removeStyleTag(FONT_ID);
  document.body.classList.forEach((className) => {
    if (className.startsWith(BODY_CLASS_PREFIX)) {
      document.body.classList.remove(className);
    }
  });
}

/**
 * Control whether the font is on or off.
 */
function updateFontMode(mode, font) {
  enabled = mode;
  currentFont = font || 'regular';

  if (enabled) {
    applyFont(currentFont);
  } else {
    removeFont();
  }
}

/**
 * Listen for changes in the page so we can react to new elements if needed.
 */
const observer = new MutationObserver((mutations) => {
  // If you need special handling for new elements, place it here,
  // but skipping big loops helps performance on huge pages.
  if (!enabled) return;
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

/**
 * Load initial settings from storage.
 */
chrome.storage.local.get(['enabled', 'font'], (data) => {
  updateFontMode(data.enabled || false, data.font || 'regular');
});

/**
 * Listen for messages from the background script.
 */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'openDyslexicIsOn' || message.type === 'updateFont') {
    updateFontMode(message.enabled || false, message.font || 'regular');
  }
});
