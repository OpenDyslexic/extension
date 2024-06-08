import { isEmptyObject } from '@scripts/content/utils';
// key for isSync is syncHelperbird
export class EngineSync {
	constructor(address = 'none') {
		this.debug = false;

		this.initialize(address);
	}

	async initialize(address) {
		if (this.debug === true) {
			console.log('Engine Sync instance has been created');
			console.log('address', address);
		}

		return true;
	}

	async all() {
		return await this.getLocal(null);
	}

	async isPaid() {
		return await this.getLocal('paid');
	}

	async getManaged(key) {
		let isArray = Array.isArray(key);

		return new Promise((resolve) => {
			chrome.storage.managed.get(key).then((result) => {
				if (chrome.runtime.lastError) {
					resolve({});
				}

				let isDataEmpty = isEmptyObject(result);
				if (isDataEmpty === true) {
					resolve({});
				}

				if (key === null || key === 'null') {
					resolve(result);
				}

				if (isArray === true) {
					resolve(result);
				} else {
					resolve(result[key]);
				}
			});
		});
	}

	async getLocal(key) {
		let isArray = Array.isArray(key);

		return new Promise((resolve) => {
			chrome.storage.local.get(key, (result) => {
				if (chrome.runtime.lastError) {
					resolve({});
				}

				let isDataEmpty = isEmptyObject(result);
				if (isDataEmpty === true) {
					resolve({});
				}

				if (key === null || key === 'null') {
					resolve(result);
				}

				if (isArray === true) {
					resolve(result);
				} else {
					resolve(result[key]);
				}
			});
		});
	}

	async saveLocal(key, value) {
		return new Promise((resolve) => {
			const obj = {};
			obj[key] = value;
			chrome.storage.local.set(obj, () => {
				if (chrome.runtime.lastError) {
					resolve({});
				} else {
					resolve({ save: true });
				}
			});
		});
	}

	async importLocal(jsonData = {}) {
		return new Promise((resolve) => {
			chrome.storage.local.set(jsonData, () => {
				if (chrome.runtime.lastError) {
					resolve({});
				} else {
					resolve({ import: true });
				}
			});
		});
	}

	async importSync(jsonData = {}) {
		return new Promise((resolve) => {
			chrome.storage.sync.set(jsonData, () => {
				if (chrome.runtime.lastError) {
					resolve({});
				} else {
					resolve({ save: true });
				}
			});
		});
	}

	async import(jsonData = {}) {
		return await this.importLocal(jsonData);
	}

	async wipe() {
		chrome.storage.local.clear();
		chrome.storage.sync.clear();
		return true;
	}

	async save(key, value) {
		return await this.saveLocal(key, value);
	}

	async get(key) {
		return await this.getLocal(key);
	}
}
