import opendyslexic from '@styles/core/opendyslexic.css?raw';
import { isExcluded } from '@scripts/content/utils.js';

let enabled = false;
let currentFont = 'regular';
let excludedSites = [];

const FONT_ID = 'opendyslexic-font-styles';
const BODY_CLASS_PREFIX = 'opendyslexic-font-';

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
}

function removeFont() {
	removeStyleTag(FONT_ID);
	removeBodyClasses();
}

function updateFontMode(mode, font) {
	enabled = mode;
	currentFont = font || 'regular';

	if (enabled && !isExcluded(window.location.hostname, excludedSites)) {
		applyFont(currentFont);
	} else {
		removeFont();
	}
}

chrome.storage.local.get(['enabled', 'font', 'excludedSites'], (data) => {
	excludedSites = data.excludedSites || [];
	updateFontMode(data.enabled || false, data.font || 'regular');
});

chrome.runtime.onMessage.addListener((message) => {
	if (message.type === 'updateExcludedSites') {
		excludedSites = message.excludedSites || [];
	}

	if (
		message.type === 'openDyslexicIsOn' ||
		message.type === 'updateFont' ||
		message.type === 'updateExcludedSites'
	) {
		updateFontMode(message.enabled || false, message.font || 'regular');
	}
});
