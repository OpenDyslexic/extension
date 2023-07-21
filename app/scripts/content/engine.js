import { Badge } from '@scripts/content/badge.js'; // Done is class
import { CustomFont } from '@scripts/content/font.js';
import { Database } from '@scripts/content/settings.js';

export class OPENDYSLEXIC {
	constructor() {
		this.isRunning = true;
		// Methods
		this.DATABASE = new Database();

		this.BADGE = new Badge(this.DATABASE);
		this.CUSTOM_FONT = new CustomFont(this.DATABASE);

		this.refresh();
		this.listener();
	}

	async on() {
		// App settings
		this.isRunning = this.DATABASE.isRunning();
		await this.DATABASE.load();

		if (this.isRunning === false) {
			this.BADGE.set('off');
		}

		if (this.isRunning === true) {
			this.BADGE.set('on');
		}

		await this.BADGE.load(this.isRunning);
		await this.CUSTOM_FONT.load(this.isRunning);

		this.FIRST_LOAD = false;
	}

	listener() {
		chrome.storage.onChanged.addListener(() => {
			this.refresh();
			return true;
		});
	}

	async refresh() {
		await this.DATABASE.load();

		this.on();
	}
}
