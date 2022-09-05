import { getBrowser } from '../utils';

export function sendToContentScript(object) {
	let browser = getBrowser();

	if (browser === 'chrome' || browser === 'edge') {
		sendToContentScriptChrome(object);
	} else if (browser === 'firefox') {
		sendToContentScriptFirefox(object);
	} else if (browser === 'safari') {
		sendToContentScriptChrome(object);
	} else {
		sendToContentScriptChrome(object);
	}
}

export function sendToContentScriptChrome(object) {
	chrome.tabs.query(
		{
			active: true,
			lastFocusedWindow: true,
			currentWindow: true
		},
		function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, object, function (response) {
				if (chrome.runtime.lastError) {
					return false;
				}
				return response;
			});
		}
	);
}

export function sendToContentScriptFirefox(objectMessage) {
	let querying = browser.tabs.query({ currentWindow: true, active: true });

	querying.then((tab) => {
		if (browser.runtime.lastError) {
			return false;
		}
		let CURRENT_TAB = tab[0].id;

		browser.tabs
			.sendMessage(CURRENT_TAB, objectMessage)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.warn('Lexedn error', error);
				return true;
			});
	});
}

export async function getTab() {
	chrome.tabs.query(
		{
			active: true,
			lastFocusedWindow: true,
			currentWindow: true
		},
		async (tab) => {
			return tab;
		}
	);
}

async function sendMessageChrome(object) {
	chrome.runtime.sendMessage(object, (response) => {
		return response;
	});
}

async function sendMessageFirefox(object) {
	let message = browser.runtime.sendMessage(object);

	message.then((response) => {
		return response;
	});
}

export async function sendToBackgroundScriptSlow(object) {
	let browser = getBrowser();

	let result = null;
	if (browser === 'chrome' || browser === 'edge') {
		result = sendMessageChrome(object);
	} else if (browser === 'firefox') {
		result = sendMessageFirefox(object);
	} else if (browser === 'safari') {
		result = sendMessageFirefox(object);
	} else {
		result = sendMessageChrome(object);
	}

	return result;
}
