import { isEmpty, isNull } from '@scripts/content/utils';

export class Database {
	constructor() {
		this.id = 'settings';
		this.isEnabled = false;
		this.paused = false;
		this.data = null;
	}

	async load() {
		return new Promise((resolve) => {
			chrome.storage.local.get(null, (settings) => {
				this.data = settings;
				resolve(this.data);
				return true; // Chrome bug
			});
		});
	}

	isRunning() {
		this.paused = this.hasProperty('enabled', false);
		return this.paused;
	}

	async set(token, type) {
		return new Promise((resolve) => {
			let setting = {};
			setting[token] = type;
			chrome.storage.local.set(setting);
			resolve(setting);
			return true; // Chrome bug
		});
	}

	get() {
		return this.data;
	}

	hasProperty(key, backup) {
		if (isEmpty(this.data) || isNull(this.data)) {
			return backup;
		}
		let result = this.data.hasOwnProperty(key);
		return result === true ? this.data[key] : backup;
	}

	enabled() {
		return this.isEnabled;
	}

	async enabled() {
		this.data = this.data === null ? await this.load() : this.data;

		return new Promise((resolve) => {
			const KEYS = ['enabled'];

			let ENABLED = [];
			for (var key of KEYS) {
				ENABLED.push(this.hasProperty(key, false));
			}

			let checker = (arr) => arr.some(Boolean);

			this.isEnabled = checker(ENABLED);

			resolve(checker(ENABLED));
			return true; // Chrome bug
		});
	}
}
