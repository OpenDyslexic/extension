export class Badge {
	constructor() {}

	async load() {
		return new Promise((resolve) => {
			// this.off();
			resolve(true);
		});
	}

	update(mail) {
		if (mail.state === true) {
			this.on();
			return mail.state;
		}

		this.off();
		return mail.state;
	}

	off() {
		this.setColor('#ff3c2f');
		this.setText('off');
	}

	on() {
		this.setColor('#34c759');
		this.setText('on');
	}

	setColor(color) {
		chrome.action.setBadgeBackgroundColor({ color: color }, () => {});
	}

	setText(text) {
		chrome.action.setBadgeText({ text: text }, () => {});
	}
}
