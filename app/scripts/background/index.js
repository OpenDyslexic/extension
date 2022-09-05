import { badge } from '../content/badge'; // Done is class
const BADGE = new badge();
// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	executeCommand(message).then(sendResponse);
	return true;
});

function executeCommand(message) {
	console.log(message);
	// Reload database.
	if (message.app === 'badge') {
		BADGE.change(message);
	}

	return true;
}
