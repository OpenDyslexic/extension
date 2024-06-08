import { config } from '@scripts/content/config';
import { Database } from '@scripts/content/database';
import { debounce, injectCssInline } from '@scripts/content/utils';
import opendyslexic from '!!raw-loader!@styles/fonts/opendyslexic.css';

export class OpenDyslexic {
	constructor() {
		this.isRunning = false;
		this.id = 'opendyslexic';
		this.font = 'regular';
		this.database = new Database();
		this.init();
	}

	init() {
		this.refresh();
		this.start();
	}

	start() {
		this.debouncedRefresh = debounce(
			this.refresh.bind(this),
			config.refresh
		);
		chrome.storage.onChanged.addListener(this.debouncedRefresh);
	}

	async applyClassToElements(className) {
		const elements = await this.getNonIconElements();
		elements.forEach((element) => element.classList.add(className));
	}

	removeFontClasses() {
		document.querySelectorAll('*').forEach((element) => {
			element.classList.forEach((className) => {
				if (className.startsWith('helperbird-font-opendyslexic-')) {
					element.classList.remove(className);
				}
			});
		});
	}

	isIconFont(fontFamily) {
		const lowerFontFamily = fontFamily.toLowerCase();
		return (
			lowerFontFamily.includes('icon') ||
			lowerFontFamily.includes('symbols')
		);
	}

	async getNonIconElements() {
		try {
			const allElements = Array.from(document.querySelectorAll('*'));
			return allElements.filter((element) => {
				const fontFamily = window.getComputedStyle(element).fontFamily;
				return !this.isIconFont(fontFamily);
			});
		} catch {
			// Fallback: return an empty array if an error occurs
			return [];
		}
	}

	getFont() {
		if (!this.isRunning) return '';

		const protocol = this.getExtensionProtocol();
		return {
			CSS: opendyslexic
				.toString()
				.replace(/\{\{\$browser_extension_protocol\}\}/g, protocol),
			CLASS: `helperbird-font-opendyslexic-${this.font}`
		};
	}

	getExtensionProtocol() {
		return chrome.runtime.getURL('') || browser.runtime.id;
	}
	async on() {
		try {
			this.isRunning = await this.database.isRunning();

			if (this.isRunning) {
				const styling = this.getFont();
				this.removeFontClasses(); // Remove old font classes before applying new ones
				await this.applyClassToElements(styling.CLASS);
				injectCssInline(this.id, styling.CSS);
			} else {
				this.toggleCSS(false);
			}
		} catch {
			// Fallback: ensure CSS is removed if any error occurs
			this.toggleCSS(false);
		}
	}
	async toggleCSS(apply) {
		try {
			if (apply) {
				const customCSS = (await this.database.getCSS()) || config.css;
				let styleElement = document.getElementById(this.id);
				if (!styleElement) {
					styleElement = document.createElement('style');
					styleElement.id = this.id;
					document.head.appendChild(styleElement);
				}
				styleElement.textContent = customCSS;
			} else {
				const styleElement = document.getElementById(this.id);
				if (styleElement) {
					styleElement.remove();
					this.removeFontClasses();
				}
			}
		} catch {
			// Fallback: ensure CSS is removed if any error occurs
			const styleElement = document.getElementById(this.id);
			if (styleElement) {
				styleElement.remove();
				this.removeFontClasses();
			}
		}
	}

	async refresh() {
		try {
			await this.database.load();
			this.font = await this.database.getFont();
			await this.on();
		} catch {
			// Fallback: ensure CSS is removed if any error occurs
			this.toggleCSS(false);
		}
	}
}
