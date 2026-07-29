// TEMPORARY PROBE - proves the engine's initial-storage-load path honours excludedSites
const FONT_ID = 'opendyslexic-font-styles';

describe('PROBE: init path with excludedSites in storage', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
		document.body.className = '';
		jest.clearAllMocks();
		chrome.runtime.onMessage.addListener.mockImplementation(() => {});
	});

	it('does NOT apply the font on a brand-new tab of an already-excluded site', () => {
		chrome.storage.local.get.mockImplementation((keys, cb) => {
			const data = { enabled: true, font: 'regular', excludedSites: ['localhost'] };
			if (cb) cb(data);
			return Promise.resolve(data);
		});

		jest.isolateModules(() => {
			require('../../app/scripts/content/engine');
		});

		expect(document.getElementById(FONT_ID)).toBeNull();
		expect(document.body.className).toBe('');
	});

	it('DOES apply the font on init when the host is not excluded', () => {
		chrome.storage.local.get.mockImplementation((keys, cb) => {
			const data = { enabled: true, font: 'bold', excludedSites: ['example.com'] };
			if (cb) cb(data);
			return Promise.resolve(data);
		});

		jest.isolateModules(() => {
			require('../../app/scripts/content/engine');
		});

		expect(document.getElementById(FONT_ID)).not.toBeNull();
		expect(document.body.className).toBe('opendyslexic-font-bold');
	});

	it('subdomain of an excluded entry is skipped on init', () => {
		chrome.storage.local.get.mockImplementation((keys, cb) => {
			const data = { enabled: true, font: 'regular', excludedSites: ['https://LocalHost:8080/x'] };
			if (cb) cb(data);
			return Promise.resolve(data);
		});

		jest.isolateModules(() => {
			require('../../app/scripts/content/engine');
		});

		expect(document.getElementById(FONT_ID)).toBeNull();
	});
});
