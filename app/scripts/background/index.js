import { Badge } from '@scripts/content/badge'; // Done is class
const BADGE = new Badge();
// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// Reload database.
	if (message.app === 'badge') {
		BADGE.change(message);
	}
	sendResponse({ response: 'OpenDyslexic' });
	return true;
});
