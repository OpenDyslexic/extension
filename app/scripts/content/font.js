import { idExists, injectCssInline, removeElementById } from '@scripts/content/utils.js';

import opendyslexicbold from '!!raw-loader!@styles/core/opendyslexic-bold.css';
import opendyslexicitalic from '!!raw-loader!@styles/core/opendyslexic-italic.css';
import opendyslexic from '!!raw-loader!@styles/core/opendyslexic-regular.css';


export class CustomFont {
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

	on() {
		this.off(); // Turn it off if it was there.
		const CSS = `
		${this.getFont().CSS}}
  `;

  injectCssInline(this.id, CSS);
	
	}

	getFont() {
		const isEnabled = this.isEnabled;
		let REPSONSE = {
			CSS: opendyslexic.toString()
		  };
	  
		if (isEnabled === false) {
			return '';
		}

		const FONT_KEY = this.font.toLowerCase().replace("-", "");
		let CHOICEN_FONT = opendyslexic.toString();

		if(FONT_KEY === 'regular') {
			 CHOICEN_FONT = opendyslexic.toString();
		}
		if(FONT_KEY === 'bold') {
			CHOICEN_FONT = opendyslexicbold.toString();
		}

		if(FONT_KEY === 'italic') {
			CHOICEN_FONT = opendyslexicitalic.toString();
		}


		const protocol = `${this.getExtensionProtocol()}`;
		REPSONSE.CSS = CHOICEN_FONT
		  .split("{{$browser_extension_protocol}}")
		  .join(protocol);
	
		return REPSONSE;

	}
	getExtensionProtocol() {
		let extensionID = chrome.runtime.getURL("") || browser.runtime.id;
	
		return extensionID;
	
	  }
	off() {
		let isFeatureRunning = idExists(this.id);
		if (isFeatureRunning === true) {
			removeElementById(this.id);
		}
	}
}
