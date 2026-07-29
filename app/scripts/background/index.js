import { isEmpty } from '@scripts/content/utils.js';
import { update } from '@scripts/content/badge.js';

chrome.storage.onChanged.addListener(async (changes, areaName) => {
	if (areaName !== 'local') {
		return;
	}

	if (changes.enabled) {
		update({ state: changes.enabled.newValue || false });
		const currentFont = await getStorage('font');
		sendToAllTabs({
			type: 'openDyslexicIsOn',
			enabled: changes.enabled.newValue,
			font: currentFont.found ? currentFont.item : 'regular'
		});
	}

	if (changes.font) {
		const isEnabled = await getStorage('enabled');
		sendToAllTabs({
			type: 'updateFont',
			font: changes.font.newValue,
			enabled: isEnabled.found ? isEnabled.item : false
		});
	}

	if (changes.excludedSites) {
		const [isEnabled, currentFont] = await Promise.all([
			getStorage('enabled'),
			getStorage('font')
		]);
		sendToAllTabs({
			type: 'updateExcludedSites',
			excludedSites: changes.excludedSites.newValue || [],
			enabled: isEnabled.found ? isEnabled.item : false,
			font: currentFont.found ? currentFont.item : 'regular'
		});
	}
});

function sendToAllTabs(message) {
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach((tab) => {
			chrome.tabs.sendMessage(tab.id, message).catch((err) => {
				if (
					!err ||
					!err.message ||
					!err.message.includes('Receiving end does not exist')
				) {
					console.debug('sendMessage failed:', err && err.message);
				}
			});
		});
	});
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
		console.error('Failed to get storage:', key, err);
	}

	return data;
}

chrome.storage.local.get(['enabled'], (data) => {
	update({ state: data.enabled || false });
});
