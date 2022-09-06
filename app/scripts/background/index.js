import { badge } from '../content/badge'; // Done is class
const BADGE = new badge();
// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// Reload database.
	if (message.app === 'badge') {
		BADGE.change(message);
	}
	sendResponse({ response: 'OpenDyslexic' });
	return true;
});
