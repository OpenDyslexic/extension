export function isNull(value) {
	return value === null;
}

export async function getCurrentURL() {
	return new Promise((resolve, reject) => {
		if (isFirefox() === true) {
			browser.windows.getCurrent((windows) => {
				let querying = browser.tabs.query({
					active: true,
					windowId: windows.id
				});
				querying.then((tab) => {
					let CURRENT_TAB = tab.url;
					resolve(CURRENT_TAB);
				});
			});
		} else {
			chrome.windows.getCurrent((windows) => {
				chrome.tabs.query(
					{
						active: true,
						windowId: windows.id
					},
					(tabs) => {
						const tabId = tabs[0].id;
						let CURRENT_TAB = tabs[0].url;

						resolve(CURRENT_TAB);
					}
				);
			});
		}
	});
}

export function $helperbird_i18n(params, replace = null) {
	return typeof browser !== 'undefined'
		? browser.i18n.getMessage(params, replace)
		: chrome.i18n.getMessage(params, replace);
}

export function isEmpty(value) {
	return (
		value === undefined ||
		value === null ||
		value === '' ||
		value === 'undefined' ||
		value === 'null'
	);
}

export function isArrayEmpty(array) {
	return array.length === 0;
}

export function isArray(array) {
	return Array.isArray(array);
}

export function isObject(object) {
	return object instanceof Object;
}

export function doesBodyHaveAttribute(attribute) {
	return document.body.hasAttribute(attribute);
}

export function removeAttributeFromBody(attribute) {
	document.body.removeAttribute(attribute);
}

export function doesClassExist(className) {
	return document.querySelectorAll(`.${className}`).length > 0;
}
export function removeElementsByClass(className) {
	const elements = document.getElementsByClassName(className);
	while (elements.length > 0) {
		elements[0].parentNode.removeChild(elements[0]);
	}
	return true;
}

export function removeClassFromClass(className) {
	const elements = document.getElementsByClassName(className);
	while (elements.length > 0) {
		elements[0].classList.remove(className);
	}
	return true;
}

export function isHEXColor(color) {
	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
}

export function removeHTMLTags(text) {
	return text.replace(/<[^>]+>/gm, '');
}

export function removeHTMLTagsWithWhiteSpace(text) {
	return text.replace(/<[^>]+>/gm, ' ');
}

export function isValidEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	);
}

export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isString(value) {
	return typeof value === 'string';
}

export function isNumber(value) {
	return typeof value === 'number';
}

export function isBoolean(value) {
	return typeof value === 'boolean';
}

export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

export function idExists(id) {
	return document.getElementById(id) !== null;
}

export function hexToRGBA(hex, percent = 1) {
	let c;
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split('');
		if (c.length == 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = '0x' + c.join('');
		return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
			','
		)},${percent})`;
	} else {
		return hex;
	}
}

export function isValidDate(date) {
	return !isNaN(date.getTime());
}

export function throttle(fn, delay) {
	let timeout;
	let noDelay = true;
	let queue = [];
	const start = () => {
		if (queue.length) {
			const first = queue.shift();
			fn.apply(first.context, first.arguments);
			timeout = setTimeout(start, delay);
		} else {
			noDelay = true;
		}
	};

	const ret = (...rest) => {
		queue.push({
			context: this,
			arguments: [...rest]
		});
		if (noDelay) {
			noDelay = false;
			start();
		}
	};

	ret.reset = () => {
		clearTimeout(timeout);
		queue = [];
	};
	return ret;
}

export function applyEngineCss(id, CSS) {
	const HEAD = document.head || document.getElementsByTagName('head')[0];
	const STYLE = document.createElement('style');
	STYLE.setAttribute('id', id);
	HEAD.appendChild(STYLE);
	STYLE.appendChild(document.createTextNode(CSS));

	const HEAD_TWO = document.getElementById('opendyslexic-reader-js');
	if (HEAD_TWO === null || HEAD === undefined) {
		return false;
	}
	const STYLE_TWO = document.createElement('style');
	STYLE_TWO.setAttribute('id', `${id}_2`);
	HEAD_TWO.appendChild(STYLE_TWO);
	STYLE_TWO.appendChild(document.createTextNode(CSS));
}

export function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

export function injectScript(url, id) {
	let script = document.createElement('script');
	script.setAttribute('id', id);

	script.src = chrome.runtime.getURL(url);

	(document.head || document.documentElement).appendChild(script);
}

export function injectCss(id, url) {
	let style = document.createElement('link');
	style.rel = 'stylesheet';
	style.type = 'text/css';
	style.setAttribute('id', id);
	style.href = chrome.runtime.getURL(url);

	document.head.appendChild(style);
}

export function injectCssInline(id, style) {
	let head = document.head || document.getElementsByTagName('head')[0];
	let sheet = document.createElement('style');

	sheet.setAttribute('id', id);

	sheet.type = 'text/css';

	sheet.appendChild(document.createTextNode(style));
	head.appendChild(sheet);
}

export function whatBrowser(userAgent) {
	var browser = {};
	var ua = userAgent.toLowerCase();
	var match =
		/(chrome)[ \/]([\w.]+)/.exec(ua) ||
		/(webkit)[ \/]([\w.]+)/.exec(ua) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
		/(msie) ([\w.]+)/.exec(ua) ||
		(ua.indexOf('compatible') < 0 &&
			/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
		[];
	browser[match[1] || ''] = true;
	browser.version = match[2] || '';
	return browser;
}

export function removeElementById(id) {
	var element = document.getElementById(id);
	if (element) {
		element.parentNode.removeChild(element);
	}

	var element = document.getElementById(`${id}_2`);
	if (element) {
		element.parentNode.removeChild(element);
	}
}

export function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getElementById(id) {
	return document.getElementById(id);
}

export function getElementByIdShadow(shadow, id) {
	return shadow.shadowRoot.getElementById(id);
}

export function hexToRGB(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
		  }
		: hex;
}

export function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

export function newTab(url) {
	window.open(url, '_blank');
}

export function removePxAndPercentage(value) {
	value = value.toString();
	return value.replace('px', '').replace('%', '');
}

export function reverseString(string) {
	return string.split('').reverse().join('');
}

export function hasProperty(object, key, backup) {
	if (isEmpty(object) || isNull(object)) {
		return backup;
	}
	let result = object.hasOwnProperty(key);
	return result === true ? object[key] : backup;
}

export function stringToBoolean(string) {
	// check if string parameter is a stirng type
	if (typeof string === 'string') {
		return JSON.parse(string);
	} else {
		return string;
	}
}

export function uppercaseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function uppercaseAllWords(string) {
	return string.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.slice(1)
	);
}

export function stripLinks(text) {
	return text.replace(/<a[^>]*>([^<>]*)<\/a>/g, '$1');
}

export function isFirefox(agent) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;
	return /firefox/i.test(userAgent);
}

export function getImageForReadingList(document) {
	if (document.getElementsByTagName('img').length !== 0) {
		return document.getElementsByTagName('img')[0].src;
	} else {
		return '';
	}
}

export function isEdge(agent) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;
	return /Edg/i.test(userAgent);
}

export function isSafari(agent) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;
	return (
		/Safari/i.test(userAgent) === true &&
		/Chrome/i.test(userAgent) === false
	);
}

export function randomNumber() {
	return Math.floor(Number.MAX_SAFE_INTEGER * Math.random());
}

export function copyTextToClipboard(text) {
	navigator.clipboard
		.writeText(text)
		.then(() => {})
		.catch((error) => {
			console.warn(error);
		});
}

export function isIPhone(agent) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;
	const iPhone =
		navigator.maxTouchPoints > 1 &&
		/iPhone/i.test(userAgent) === true &&
		/Safari/i.test(userAgent) === true &&
		/Chrome/i.test(userAgent) === false;
	return iPhone;
}

export function isiPad(agent) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;
	const iPad =
		navigator.maxTouchPoints > 1 &&
		/Safari/i.test(userAgent) &&
		/Chrome/i.test(userAgent) === false;

	return iPad;
}

export function isChrome(agent, vendor) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;
	let vendorAgent = isEmpty(vendor) ? navigator.vendor : vendor;
	return /Chrome/.test(userAgent) && /Google Inc/.test(vendorAgent);
}

export function getBrowser() {
	if (isFirefox()) {
		return 'firefox';
	} else if (isEdge()) {
		return 'edge';
	} else if (isChrome()) {
		return 'chrome';
	} else if (isSafari()) {
		return 'safari';
	} else {
		return 'chrome';
	}
}

export function getDomainFromEmail(email) {
	return email.split('@')[1];
}

export default {
	isSafari: isSafari,
	isEdge: isEdge,
	isFirefox: isFirefox,
	isChrome: isChrome,
	isIPhone: isIPhone,
	isiPad: isiPad
};
