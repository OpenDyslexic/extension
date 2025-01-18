export function update(mail) {
	console.log('ddd', mail);
	if (mail.state === true) {
		on();
		return mail.state;
	}

	off();
	return mail.state;
}

export function off() {
	setColor('#ff3c2f');
	setText('off');
}

export function on() {
	setColor('#34c759');
	setText('on');
}

function setColor(color) {
	chrome.action.setBadgeBackgroundColor({ color: color }, () => {});
}

function setText(text) {
	chrome.action.setBadgeText({ text: text }, () => {});
}
