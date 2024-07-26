// Done is class
import { FontInjector } from '@scripts/content/font.js';
import { Database } from '@scripts/content/settings.js';

export class OPENDYSLEXIC {
	constructor() {
		this.isRunning = false;
		// Methods
		this.DATABASE = new Database();

	
		this.CUSTOM_FONT = new FontInjector(this.DATABASE);

		this.refresh();
		this.listener();
	}

	async on() {
		// App settings
		this.isRunning = this.DATABASE.isRunning();
		await this.DATABASE.load();

	

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
