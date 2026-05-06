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
			['enabled', 'font'],
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

	it('preserves the original font for private-use glyphs', () => {
		const icon = document.createElement('span');
		icon.textContent = '\uE000';
		document.body.appendChild(icon);

		messageListener({
			type: 'updateFont',
			enabled: true,
			font: 'regular'
		});

		expect(icon.classList.contains('opendyslexic-preserve-font')).toBe(true);
	});

	it('preserves private-use glyphs added after the font is enabled', async () => {
		messageListener({
			type: 'updateFont',
			enabled: true,
			font: 'regular'
		});

		const icon = document.createElement('span');
		icon.textContent = '\uE000';
		document.body.appendChild(icon);

		await Promise.resolve();

		expect(icon.classList.contains('opendyslexic-preserve-font')).toBe(true);
	});

	it('removes preserved font markers when disabled', () => {
		const icon = document.createElement('span');
		icon.textContent = '\uE000';
		document.body.appendChild(icon);

		messageListener({
			type: 'updateFont',
			enabled: true,
			font: 'regular'
		});
		messageListener({
			type: 'updateFont',
			enabled: false,
			font: 'regular'
		});

		expect(icon.classList.contains('opendyslexic-preserve-font')).toBe(false);
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
