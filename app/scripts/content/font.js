import {
	idExists,
	injectCssInline,
	removeElementById
} from '@scripts/content/utils.js';
import opendyslexic from '!!raw-loader!@styles/core/opendyslexic.css';

export class FontInjector {
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
		this.settings = this.database.get();

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

	async on() {
		this.off();
		let styling = this.getFont();

		await this.applyCustomClassToNonIconElements(styling.CLASS);

		const CSS = `
		${styling.CSS}}
  `;

		injectCssInline(this.id, CSS);
	}
	removeOpenDyslexicFontClasses() {
		const allElements = document.querySelectorAll('*');

		allElements.forEach((element) => {
			const classes = element.classList;
			for (let i = 0; i < classes.length; i++) {
				const className = classes[i];
				if (className.includes('helperbird-font-')) {
					element.classList.remove(className);
				}
			}
		});
	}

	isIconFont(fontFamily) {
		// Modify this function to check if the font-family belongs to an icon font.
		// You can add your logic here to identify icon fonts based on their font-family.
		// For the sake of this example, I'll assume that icon fonts have "icon" in their font-family.
		return (
			fontFamily.toLowerCase().includes('icon') ||
			fontFamily.toLowerCase().includes('symbols')
		);
	}

	separateIconElements(className) {
		return new Promise((resolve) => {
			const allElements = document.querySelectorAll('*');
			const iconElements = [];
			const nonIconElements = [];

			allElements.forEach((element) => {
				const fontFamily = window.getComputedStyle(element).fontFamily;
				if (this.isIconFont(fontFamily)) {
					iconElements.push(element);
				} else {
					// Remove the custom class if it already exists and contains "helperbird-opendyslexic-font-"
					if (
						element.classList.contains(className) &&
						className.includes('helperbird-font-')
					) {
						element.classList.remove(className);
					}
					nonIconElements.push(element);
				}
			});

			resolve({ iconElements, nonIconElements });
		});
	}

	async applyCustomClassToNonIconElements(className) {
		const { nonIconElements } = await this.separateIconElements(className);
		nonIconElements.forEach((element) => {
			element.classList.add(className);
		});
	}

	getFont() {
		const isEnabled = this.isEnabled;

		let REPSONSE = {
			CSS: opendyslexic.toString(),
			CLASS: `helperbird-font-opendyslexic-${this.font.toLowerCase()}`
		};

		if (isEnabled === false) {
			return '';
		}

		const protocol = `${this.getExtensionProtocol()}`;
		REPSONSE.CSS = opendyslexic
			.toString()
			.split('{{$browser_extension_protocol}}')
			.join(protocol);

		return REPSONSE;
	}
	getExtensionProtocol() {
		let extensionID = chrome.runtime.getURL('') || browser.runtime.id;

		return extensionID;
	}
	off() {
		let isFeatureRunning = idExists(this.id);

		if (isFeatureRunning === true) {
			this.removeOpenDyslexicFontClasses();
			removeElementById(this.id);
		}
	}
}
