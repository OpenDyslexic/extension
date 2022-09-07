import { isFirefox } from '../utils';
import { sendToBackgroundScriptSlow } from './api';

export class badge {
	constructor() {}

	async load() {
		return new Promise((resolve) => {
			resolve(true);
		});
	}

	change(object) {
		switch (object.state) {
			case 'on': {
				this.on();
				break;
			}
			case 'off': {
				this.off();
				break;
			}
			default:
				this.off();
		}
	}

	set(state = false) {
		let message = {
			app: 'badge',
			state: state
		};
		sendToBackgroundScriptSlow(message);
	}

	off() {
		this.setColor('#ff3c2f');
		this.setText('off');

		return false;
	}

	on() {
		this.setColor('#34c759');
		this.setText('on');
	}

	setColor(color) {
		if (isFirefox() === true) {
			browser.browserAction.setBadgeBackgroundColor({ color: color });
		} else {
			chrome.action.setBadgeBackgroundColor({ color: color });
		}
	}

	setText(text) {
		if (isFirefox() === true) {
			browser.browserAction.setBadgeText({ text: text });
		} else {
			chrome.action.setBadgeText({ text: text });
		}
	}
}
