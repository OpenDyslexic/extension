import { isEmpty } from '@scripts/content/utils.js';
import { update } from '@scripts/content/badge.js';

chrome.storage.onChanged.addListener(async (changes, areaName) => {
	if (areaName !== 'local' && areaName !== 'sync') {
		return;
	}

	const currentFont = await getStorage('font');
	const isEnabled = await getStorage('enabled');

    

	if (changes.enabled) {

        update({ state:  changes.enabled.newValue || false });
		const newMode = changes.enabled.newValue;
		sendToAllTabs({
			type: 'openDyslexicIsOn',
			enabled: newMode,
			font: currentFont.found ? currentFont.item : 'regular'
		});
	}

	if (changes.font) {
		const newFont = changes.font.newValue;
		sendToAllTabs({
			type: 'updateFont',
			font: newFont,
			enabled: isEnabled.found ? isEnabled.item : false
		});
	}
});

function sendToAllTabs(message) {
	try {
		chrome.tabs.query({}, (tabs) => {
			tabs.forEach((tab) => {
				chrome.tabs.sendMessage(tab.id, message);
			});
		});
	} catch (error) {}
}

async function getStorage(key) {
	const data = {
		found: false,
		item: ''
	};

	if (isEmpty(key)) {
		return data;
	}

	try {
		const result = await chrome.storage.local.get(key);
		if (!isEmpty(result[key])) {
			data.found = true;
			data.item = result[key];
		}
	} catch (err) {
		return data;
	}

	return data;
}


/**
 * Load initial settings from storage.
 */
chrome.storage.local.get(['enabled'], (data) => {
	update({ state:  data.enabled || false });
  });
  