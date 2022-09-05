import { idExists, injectCss, removeElementById } from '../utils';

export class customFont {
	constructor(database) {
		this.font = 'opendyslexic-regular';
		this.id = 'opendyslexic-regular';
		this.database = database;

		this.key = 'enabled';
		this.isEnabled = false;
		this.settings = null;
	}

	async load(isRunning) {
		this.isEnabled = this.database.hasProperty(this.key, false);
		this.settings = await this.database.get();

		this.font = this.settings.font ? this.settings.font : this.font;

		if (this.isEnabled && isRunning === true) {
			this.on();
		} else {
			this.off();
		}
		return new Promise((resolve) => {
			resolve(this.isEnabled);
		});
	}

	async enabled() {
		return new Promise((resolve) => {
			resolve(this.isEnabled);
		});
	}

	on() {
		this.off(); // Turn it off if it was there.
		console.log('font', this.font);

		injectCss(
			this.id,
			`assets/styles/fonts/opendyslexic-${this.font.toLowerCase()}.css`
		);
	}

	off() {
		let isFeatureRunning = idExists(this.id);
		if (isFeatureRunning === true) {
			removeElementById(this.id);
		}
	}
}
