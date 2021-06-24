let openDyslexic = {
	init() {
		this.checkStatus(); // Check if the check box is set.
	},
	isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) return false;
		}
		return true;
	},

	checkStatus() {
		const keysArray = ['enabled', 'font'];

		chrome.storage.sync.get(keysArray, (setting) => {
			let enabled = setting.enabled;
			let defaultFont = 'opendyslexic-regular';
			try {
				if (this.isEmpty(setting.font) === false) {
					defaultFont = `opendyslexic-${setting.font.font}`;
				}

				if (enabled === true) {
					openDyslexic.enableOpenDyslexic(defaultFont);
				}

				if (enabled === false) {
					openDyslexic.disableOpenDyslexic();
				}
			} catch (error) {
				let defaultFont = 'opendyslexic-regular';

				if (enabled === true) {
					openDyslexic.enableOpenDyslexic(defaultFont);
				}

				if (enabled === false) {
					openDyslexic.disableOpenDyslexic();
				}
			}
		});
	},
	disableOpenDyslexic() {
		let elem = document.getElementById('opendyslexic');
		if (elem) {
			// available
			elem.parentNode.removeChild(elem);
			(document.head || document.documentElement).removeChild(elem);
		}
	},
	enableOpenDyslexic(defaultFont) {
		let style = document.createElement('link');
		style.rel = 'stylesheet';
		style.type = 'text/css';
		style.setAttribute('id', 'opendyslexic');

		style.href = chrome.extension.getURL(
			`styles/core/${defaultFont.toLowerCase()}.css`
		);

		document.head.appendChild(style);
	}
};

openDyslexic.init();

chrome.runtime.onMessage.addListener(({ message }, sender, sendResponse) => {
	if (message === 'reload') {
		location.reload();
	}

	sendResponse({});

	return true;
});
