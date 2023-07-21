export function $helperbird_i18n(params, replace = null) {
	return typeof browser !== 'undefined'
		? browser.i18n.getMessage(params, replace)
		: chrome.i18n.getMessage(params, replace);
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

export function isChrome(agent, vendor) {
	let userAgent = isEmpty(agent) ? navigator.userAgent : agent;
	let vendorAgent = isEmpty(vendor) ? navigator.vendor : vendor;
	return /Chrome/.test(userAgent) && /Google Inc/.test(vendorAgent);
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
	let head = document.head || document.getElementsByTagName("head")[0];
	let sheet = document.createElement("style");
  
	sheet.setAttribute("id", id);
  
	sheet.type = "text/css";
  
	sheet.appendChild(document.createTextNode(style));
	head.appendChild(sheet);
  }


  export function idExists(id) {
	return document.getElementById(id) !== null;
}




export function isNull(value) {
	return value === null;
}























export default {
	isSafari: isSafari,
	isEdge: isEdge,
	isFirefox: isFirefox,
	isChrome: isChrome
};
