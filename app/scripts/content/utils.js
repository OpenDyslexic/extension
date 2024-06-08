export function $coffeeandfun_i18n(params, replace = null) {
	return typeof browser !== 'undefined'
		? browser.i18n.getMessage(params, replace)
		: chrome.i18n.getMessage(params, replace);
}

export async function getBrowserVersion() {
	try {
		const userAgent = navigator.userAgent;
		const versionStart = userAgent.indexOf('Chrome/');

		if (versionStart !== -1) {
			const version = userAgent.substring(
				versionStart + 7,
				userAgent.indexOf(' ', versionStart)
			);
			const versionParts = version.split('.');
			return parseInt(versionParts[0], 10); // Return the major version as a number
		} else {
			// Return a default value if browser version is not found
			return 100; // Return a default value if an error occurs
		}
	} catch (error) {
		console.warn('Error getting browser version:', error);
		return 100; // Return a default value if an error occurs
	}
}

export function debounce(func, wait) {
	let timeout;

	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
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
export function isFirefox(agent) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;
	return /firefox/i.test(userAgent);
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

export function isIPhone() {
	let userAgent = navigator.userAgent;
	const iPhone =
		navigator.maxTouchPoints > 1 &&
		/iPhone/i.test(userAgent) === true &&
		/Safari/i.test(userAgent) === true &&
		/Chrome/i.test(userAgent) === false;
	return iPhone;
}

export function isiPad() {
	let userAgent = navigator.userAgent;
	const iPad =
		navigator.maxTouchPoints > 1 &&
		/Safari/i.test(userAgent) &&
		/Chrome/i.test(userAgent) === false;

	return iPad;
}

export function isChrome(agent) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;

	return /Chrome/.test(userAgent) && !isEdge(agent) && !isSafari(agent);
}

export function getVersionNumber() {
	let manifest =
		typeof browser !== 'undefined'
			? browser.runtime.getManifest()
			: chrome.runtime.getManifest();

	try {
		return manifest.version;
	} catch (e) {
		return manifest.version;
	}
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

export function injectCssInline(id, style) {
	let head = document.head || document.getElementsByTagName('head')[0];
	let sheet = document.createElement('style');

	sheet.setAttribute('id', id);

	sheet.type = 'text/css';

	sheet.appendChild(document.createTextNode(style));
	head.appendChild(sheet);
}

export function idExists(id) {
	return document.getElementById(id) !== null;
}

export function isNull(value) {
	return value === null;
}
export function isEmptyObject(obj) {
	return (
		obj === null ||
		obj === undefined ||
		obj === 'null' ||
		obj === 'undefined' ||
		Object.keys(obj).length === 0
	);
}

export default {
	isSafari: isSafari,
	isEdge: isEdge,
	isFirefox: isFirefox,
	isChrome: isChrome
};
