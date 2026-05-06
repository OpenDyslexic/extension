import opendyslexic from '!!raw-loader!@styles/core/opendyslexic.css';

let enabled = false;
let currentFont = 'regular';

const FONT_ID = 'opendyslexic-font-styles';
const BODY_CLASS_PREFIX = 'opendyslexic-font-';
const PRESERVE_FONT_CLASS = 'opendyslexic-preserve-font';
const PRIVATE_USE_TEXT = /[\uE000-\uF8FF\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]/u;

let preserveFontObserver = null;

function injectCssInline(id, cssString) {
	let styleTag = document.getElementById(id);
	if (!styleTag) {
		styleTag = document.createElement('style');
		styleTag.id = id;
		document.head.appendChild(styleTag);
	}
	styleTag.textContent = cssString;
}

function removeStyleTag(id) {
	const elem = document.getElementById(id);
	if (elem) {
		elem.remove();
	}
}

function removeBodyClasses() {
	Array.from(document.body.classList)
		.filter((className) => className.startsWith(BODY_CLASS_PREFIX))
		.forEach((className) => document.body.classList.remove(className));
}

function markPrivateUseText(root = document.body) {
	const nodeFilter = document.defaultView?.NodeFilter || NodeFilter;
	const treeWalker = document.createTreeWalker(root, nodeFilter.SHOW_TEXT);

	while (treeWalker.nextNode()) {
		const parent = treeWalker.currentNode.parentElement;
		if (parent && PRIVATE_USE_TEXT.test(treeWalker.currentNode.nodeValue)) {
			parent.classList.add(PRESERVE_FONT_CLASS);
		}
	}
}

function observePrivateUseText() {
	if (preserveFontObserver || typeof MutationObserver === 'undefined') return;

	preserveFontObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'characterData') {
				const parent = mutation.target.parentElement;
				if (parent && PRIVATE_USE_TEXT.test(mutation.target.nodeValue)) {
					parent.classList.add(PRESERVE_FONT_CLASS);
				}
				return;
			}

			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.TEXT_NODE) {
					const parent = node.parentElement;
					if (parent && PRIVATE_USE_TEXT.test(node.nodeValue)) {
						parent.classList.add(PRESERVE_FONT_CLASS);
					}
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					markPrivateUseText(node);
				}
			});
		});
	});

	preserveFontObserver.observe(document.body, {
		childList: true,
		characterData: true,
		subtree: true
	});
}

function removePreservedFontClasses() {
	document
		.querySelectorAll(`.${PRESERVE_FONT_CLASS}`)
		.forEach((element) => element.classList.remove(PRESERVE_FONT_CLASS));
}

function applyFont(fontName) {
	removeStyleTag(FONT_ID);

	const protocol = chrome.runtime.getURL('');
	const cssString = opendyslexic
		.toString()
		.replace(/{{\$browser_extension_protocol}}/g, protocol);

	injectCssInline(FONT_ID, cssString);
	removeBodyClasses();

	const className = BODY_CLASS_PREFIX + fontName.toLowerCase();
	document.body.classList.add(className);
	markPrivateUseText();
	observePrivateUseText();
}

function removeFont() {
	removeStyleTag(FONT_ID);
	removeBodyClasses();
	removePreservedFontClasses();

	if (preserveFontObserver) {
		preserveFontObserver.disconnect();
		preserveFontObserver = null;
	}
}

function updateFontMode(mode, font) {
	enabled = mode;
	currentFont = font || 'regular';

	if (enabled) {
		applyFont(currentFont);
	} else {
		removeFont();
	}
}

chrome.storage.local.get(['enabled', 'font'], (data) => {
	updateFontMode(data.enabled || false, data.font || 'regular');
});

chrome.runtime.onMessage.addListener((message) => {
	if (message.type === 'openDyslexicIsOn' || message.type === 'updateFont') {
		updateFontMode(message.enabled || false, message.font || 'regular');
	}
});
