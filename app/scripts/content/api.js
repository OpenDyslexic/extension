import { config } from '@scripts/content/config';
import { getBrowser } from '@scripts/content/utils';

export async function sendToContentScript(MAIL, tabID = false) {
	let browser = getBrowser();

	let message;
	if (browser === 'chrome' || browser === 'edge' || browser === 'safari') {
		message = await sendToContentScriptChrome(MAIL, tabID);
	} else if (browser === 'firefox') {
		message = await sendToContentScriptFirefox(MAIL, tabID);
	} else {
		message = await sendToContentScriptChrome(MAIL, tabID); // Default to Chrome if browser is none of the above
	}

	return message;
}

export async function flash(text = '') {
	let API_URL = `${config.API_URL}api/v1/smart/flash`;

	let response = await POST(`${API_URL}`, {
		fullText: text
	})
		.then((result) => {
			return result;
		})
		.catch(() => {
			return {
				accessDenied: false,
				message: "Couldn't summarize the text",
				data: {},
				error: true
			};
		});

	return response;
}

export async function sendToContentScriptChrome(MAIL, tabID = false) {
	let MAIL_RETRY = {
		app: 'alert',
		popup: 'alert',
		message: 'couldnt_interact',
		replacement: '',
		messageType: 'error',
		error: true
	};

	try {
		let querying = await getTab();

		if (querying.length === 0) {
			return MAIL_RETRY;
		}
		const CURRENT_TAB = tabID === false ? querying.id : tabID;

		const RESULT = await chrome.tabs.sendMessage(CURRENT_TAB, MAIL);

		if (chrome.runtime.lastError || RESULT === 'error') {
			console.warn(
				`🦉 Helperbird  error: ${chrome.runtime.lastError.message}`
			);
			return MAIL_RETRY;
		} else {
			return RESULT;
		}
	} catch (error) {
		console.warn('🦉 Helperbird error here', error);
		return MAIL_RETRY;
	}
}

export async function sendToContentScriptFirefox(MAIL, tabID = false) {
	let MAIL_RETRY = {
		app: 'alert',
		popup: 'alert',
		message: 'couldnt_interact',
		replacement: '',
		messageType: 'error',
		error: true
	};
	try {
		let tab = await browser.tabs.query({
			active: true,
			currentWindow: true
		});

		if (tab.length === 0) {
			return MAIL_RETRY;
		}

		let CURRENT_TAB = tabID === false ? tab[0].id : tabID;

		const RESULT = await browser.tabs.sendMessage(CURRENT_TAB, MAIL);

		if (chrome.runtime.lastError || RESULT === 'error') {
			console.warn(`🦉 Helperbird : ${chrome.runtime.lastError.message}`);
			return MAIL_RETRY;
		} else {
			return RESULT;
		}
	} catch (error) {
		console.warn('🦉 Helperbird  error here', error);
		return MAIL_RETRY;
	}
}

export async function getTab() {
	let queryOptions = { active: true, currentWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);

	return tab;
}

export async function research(query, language = 'en') {
	let API_URL = `${config.API_URL}api/v1/smart/dictionary/`;

	let API_STATUS = await POST(API_URL, {
		language: language,
		word: query
	})
		.then(async (result) => {
			let json = await result;
			return json;
		})
		.catch(async () => {
			return false;
		});
	return API_STATUS;
}

export async function POST(url = '', data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}

export async function GET(url = '') {
	const response = await fetch(url);
	return response; // parses JSON response into native JavaScript objects
}

export async function maths(image = '', language = 'en') {
	let API_URL = `${config.API_URL}api/v1/smart/maths/`;

	let response = await POST(`${API_URL}`, {
		image: image,
		language: language
	})
		.then((result) => {
			return result;
		})
		.catch(() => {
			return {
				accessDenied: false,
				message: 'Could not get maths from image - Helperbird',
				data: {},
				error: true
			};
		});

	return response;
}

export async function extract(image = '', language = 'en') {
	let API_URL = `${config.API_URL}api/v1/smart/extract`;

	let response = await POST(`${API_URL}`, {
		image: image,
		language: language
	})
		.then((result) => {
			return result;
		})
		.catch(() => {
			return {
				accessDenied: false,
				message: 'Could not extract text from image - Helperbird',
				data: {},
				error: true
			};
		});

	return response;
}

export async function simplify(text = '', code = 0) {
	let API_URL = `${config.API_URL}api/v1/smart/simplify`;

	let response = await POST(`${API_URL}`, {
		fullText: text,
		prompt: code
	})
		.then((result) => {
			return result;
		})
		.catch(() => {
			return {
				accessDenied: false,
				message: "Couldn't simplify the text",
				data: {},
				error: true
			};
		});

	return response;
}

export async function summarize(text = '') {
	let API_URL = `${config.API_URL}api/v1/smart/summarize`;

	let response = await POST(`${API_URL}`, {
		fullText: text
	})
		.then((result) => {
			return result;
		})
		.catch(() => {
			return {
				accessDenied: false,
				message: "Couldn't summarize the text",
				data: {},
				error: true
			};
		});

	return response;
}

async function sendMessageChrome(object) {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage(object, (response) => {
			resolve(response);
		});
	});
}
async function sendMessageFirefox(MAIL) {
	return new Promise((resolve) => {
		let message = browser.runtime.sendMessage(MAIL);

		message.then((response) => {
			resolve(response);
		});
	});
}

export async function sendToBackgroundScript(MAIL) {
	let browser = getBrowser();

	let result = null;
	if (browser === 'chrome' || browser === 'edge') {
		result = await sendMessageChrome(MAIL);
	} else if (browser === 'firefox') {
		result = await sendMessageFirefox(MAIL);
	} else if (browser === 'safari') {
		result = await sendMessageChrome(MAIL);
	} else {
		result = await sendMessageChrome(MAIL);
	}

	return result;
}
