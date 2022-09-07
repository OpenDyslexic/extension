import { idExists, injectCss, removeElementById } from '../utils';

export class customFont {
	constructor(database) {
		this.font = 'regular';
		this.id = 'regular';



		this.key = 'enabled';
		this.isEnabled = false;
		this.database = database;
		this.settings = null;
	}

	async load(isRunning) {
		this.isEnabled = this.database.hasProperty(this.key, false);
		this.settings =  this.database.get();

		this.font = this.settings.font ? this.settings.font : this.font;

		if (this.isEnabled && isRunning === true) {
			this.on();
		} else {
			this.off();
		}
		return new Promise((resolve) => {
			resolve(this.isEnabled);
			return true; // Chrome bug
		});
	}

	async enabled() {
		return new Promise((resolve) => {
			resolve(this.isEnabled);
			return true; // Chrome bug
		});
	}

	on() {
		this.off(); // Turn it off if it was there.

		injectCss(
			this.id,
			`assets/styles/core/opendyslexic-${this.font.toLowerCase()}.css`
		);
	}

	off() {
		let isFeatureRunning = idExists(this.id);
		if (isFeatureRunning === true) {
			removeElementById(this.id);
		}
	}
}
