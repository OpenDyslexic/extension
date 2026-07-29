const FONT_ID = 'opendyslexic-font-styles';
const BODY_CLASS_PREFIX = 'opendyslexic-font-';

let messageListener;
let storageCallback;

beforeEach(() => {
	document.head.innerHTML = '';
	document.body.className = '';
	jest.clearAllMocks();

	chrome.runtime.onMessage.addListener.mockImplementation((listener) => {
		messageListener = listener;
	});

	chrome.storage.local.get.mockImplementation((keys, callback) => {
		if (callback) callback({ enabled: false, font: 'regular' });
		return Promise.resolve({ enabled: false, font: 'regular' });
	});

	jest.isolateModules(() => {
		require('../../app/scripts/content/engine');
	});
});

describe('engine initialization', () => {
	it('loads initial settings from storage', () => {
		expect(chrome.storage.local.get).toHaveBeenCalledWith(
			['enabled', 'font', 'excludedSites'],
			expect.any(Function)
		);
	});

	it('registers a message listener', () => {
		expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
	});
});

describe('font application via messages', () => {
	it('applies font when receiving openDyslexicIsOn message with enabled true', () => {
		messageListener({
			type: 'openDyslexicIsOn',
			enabled: true,
			font: 'regular'
		});

		expect(document.getElementById(FONT_ID)).not.toBeNull();
		expect(
			document.body.classList.contains(`${BODY_CLASS_PREFIX}regular`)
		).toBe(true);
	});

	it('applies bold font class when font is bold', () => {
		messageListener({
			type: 'updateFont',
			enabled: true,
			font: 'bold'
		});

		expect(
			document.body.classList.contains(`${BODY_CLASS_PREFIX}bold`)
		).toBe(true);
	});

	it('applies italic font class when font is italic', () => {
		messageListener({
			type: 'updateFont',
			enabled: true,
			font: 'italic'
		});

		expect(
			document.body.classList.contains(`${BODY_CLASS_PREFIX}italic`)
		).toBe(true);
	});

	it('removes font when receiving message with enabled false', () => {
		messageListener({
			type: 'openDyslexicIsOn',
			enabled: true,
			font: 'regular'
		});

		expect(document.getElementById(FONT_ID)).not.toBeNull();

		messageListener({
			type: 'openDyslexicIsOn',
			enabled: false,
			font: 'regular'
		});

		expect(document.getElementById(FONT_ID)).toBeNull();
		expect(
			document.body.classList.contains(`${BODY_CLASS_PREFIX}regular`)
		).toBe(false);
	});

	it('removes old body classes before adding new one', () => {
		messageListener({
			type: 'updateFont',
			enabled: true,
			font: 'regular'
		});

		expect(
			document.body.classList.contains(`${BODY_CLASS_PREFIX}regular`)
		).toBe(true);

		messageListener({
			type: 'updateFont',
			enabled: true,
			font: 'bold'
		});

		expect(
			document.body.classList.contains(`${BODY_CLASS_PREFIX}regular`)
		).toBe(false);
		expect(
			document.body.classList.contains(`${BODY_CLASS_PREFIX}bold`)
		).toBe(true);
	});

	it('defaults to regular when no font specified', () => {
		messageListener({
			type: 'openDyslexicIsOn',
			enabled: true
		});

		expect(
			document.body.classList.contains(`${BODY_CLASS_PREFIX}regular`)
		).toBe(true);
	});

	it('ignores unknown message types', () => {
		messageListener({
			type: 'unknownType',
			enabled: true,
			font: 'regular'
		});

		expect(document.getElementById(FONT_ID)).toBeNull();
	});
});

describe('style tag management', () => {
	it('creates style tag with correct ID', () => {
		messageListener({
			type: 'openDyslexicIsOn',
			enabled: true,
			font: 'regular'
		});

		const styleTag = document.getElementById(FONT_ID);
		expect(styleTag).not.toBeNull();
		expect(styleTag.tagName).toBe('STYLE');
	});

	it('reuses existing style tag on reapply', () => {
		messageListener({ type: 'updateFont', enabled: true, font: 'regular' });
		messageListener({ type: 'updateFont', enabled: true, font: 'bold' });

		const styleTags = document.querySelectorAll(`#${FONT_ID}`);
		expect(styleTags.length).toBe(1);
	});

	it('removes style tag on disable', () => {
		messageListener({
			type: 'openDyslexicIsOn',
			enabled: true,
			font: 'regular'
		});
		messageListener({
			type: 'openDyslexicIsOn',
			enabled: false,
			font: 'regular'
		});

		expect(document.getElementById(FONT_ID)).toBeNull();
	});
});

describe('excluded sites', () => {
	// jsdom serves these tests from http://localhost
	it('does not apply the font on an excluded host', () => {
		messageListener({
			type: 'updateExcludedSites',
			excludedSites: ['localhost'],
			enabled: true,
			font: 'regular'
		});

		expect(document.getElementById(FONT_ID)).toBeNull();
		expect(document.body.className).toBe('');
	});

	it('applies the font when the host is not excluded', () => {
		messageListener({
			type: 'updateExcludedSites',
			excludedSites: ['example.com'],
			enabled: true,
			font: 'regular'
		});

		expect(document.getElementById(FONT_ID)).not.toBeNull();
		expect(document.body.className).toBe(`${BODY_CLASS_PREFIX}regular`);
	});

	it('removes an already applied font once the host is excluded', () => {
		messageListener({
			type: 'openDyslexicIsOn',
			enabled: true,
			font: 'bold'
		});
		expect(document.getElementById(FONT_ID)).not.toBeNull();

		messageListener({
			type: 'updateExcludedSites',
			excludedSites: ['localhost'],
			enabled: true,
			font: 'bold'
		});

		expect(document.getElementById(FONT_ID)).toBeNull();
	});

	it('reapplies the font once the host is removed from the list', () => {
		messageListener({
			type: 'updateExcludedSites',
			excludedSites: ['localhost'],
			enabled: true,
			font: 'regular'
		});
		expect(document.getElementById(FONT_ID)).toBeNull();

		messageListener({
			type: 'updateExcludedSites',
			excludedSites: [],
			enabled: true,
			font: 'regular'
		});

		expect(document.getElementById(FONT_ID)).not.toBeNull();
	});

	it('keeps the exclusion in effect for later font changes', () => {
		messageListener({
			type: 'updateExcludedSites',
			excludedSites: ['localhost'],
			enabled: true,
			font: 'regular'
		});

		messageListener({ type: 'updateFont', enabled: true, font: 'italic' });

		expect(document.getElementById(FONT_ID)).toBeNull();
	});
});
