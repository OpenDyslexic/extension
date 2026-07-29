import {
	isEmpty,
	$helperbird_i18n,
	getBrowser,
	isChrome,
	isFirefox,
	isEdge,
	isSafari,
	normaliseHost,
	isExcluded,
	MAX_EXCLUDED_SITES
} from '../../app/scripts/content/utils';

describe('normaliseHost', () => {
	it.each([
		['example.com', 'example.com'],
		['  Example.COM  ', 'example.com'],
		['www.example.com', 'example.com'],
		['https://example.com', 'example.com'],
		['http://www.example.com/some/path', 'example.com'],
		['https://example.com:8443/x?y=1#z', 'example.com'],
		['example.com/path', 'example.com'],
		['docs.example.com', 'docs.example.com']
	])('normalises %s to %s', (input, expected) => {
		expect(normaliseHost(input)).toBe(expected);
	});

	it('returns an empty string for empty input', () => {
		expect(normaliseHost('')).toBe('');
		expect(normaliseHost(null)).toBe('');
		expect(normaliseHost(undefined)).toBe('');
	});
});

describe('isExcluded', () => {
	it('matches an exact host', () => {
		expect(isExcluded('example.com', ['example.com'])).toBe(true);
	});

	it('matches a subdomain of an excluded host', () => {
		expect(isExcluded('docs.example.com', ['example.com'])).toBe(true);
	});

	it('ignores www on either side', () => {
		expect(isExcluded('www.example.com', ['example.com'])).toBe(true);
		expect(isExcluded('example.com', ['www.example.com'])).toBe(true);
	});

	it('does not match an unrelated host', () => {
		expect(isExcluded('example.org', ['example.com'])).toBe(false);
	});

	it('does not match a host that merely ends with the same text', () => {
		expect(isExcluded('notexample.com', ['example.com'])).toBe(false);
	});

	it('returns false for an empty or missing list', () => {
		expect(isExcluded('example.com', [])).toBe(false);
		expect(isExcluded('example.com', undefined)).toBe(false);
		expect(isExcluded('example.com', null)).toBe(false);
	});

	it('returns false for an empty hostname', () => {
		expect(isExcluded('', ['example.com'])).toBe(false);
	});

	it('skips empty entries in the list', () => {
		expect(isExcluded('example.com', ['', null, 'example.com'])).toBe(true);
		expect(isExcluded('example.com', ['', null])).toBe(false);
	});
});

describe('MAX_EXCLUDED_SITES', () => {
	it('caps the excluded list at five sites', () => {
		expect(MAX_EXCLUDED_SITES).toBe(5);
	});
});

describe('isEmpty', () => {
	it('returns true for null', () => {
		expect(isEmpty(null)).toBe(true);
	});

	it('returns true for undefined', () => {
		expect(isEmpty(undefined)).toBe(true);
	});

	it('returns true for empty string', () => {
		expect(isEmpty('')).toBe(true);
	});

	it('returns false for non-empty string', () => {
		expect(isEmpty('hello')).toBe(false);
	});

	it('returns false for zero', () => {
		expect(isEmpty(0)).toBe(false);
	});

	it('returns false for false', () => {
		expect(isEmpty(false)).toBe(false);
	});

	it('returns false for an object', () => {
		expect(isEmpty({})).toBe(false);
	});
});

describe('$helperbird_i18n', () => {
	it('calls chrome.i18n.getMessage with the key', () => {
		$helperbird_i18n('testKey');
		expect(chrome.i18n.getMessage).toHaveBeenCalledWith('testKey', null);
	});

	it('passes replacement string to getMessage', () => {
		$helperbird_i18n('testKey', 'replacement');
		expect(chrome.i18n.getMessage).toHaveBeenCalledWith(
			'testKey',
			'replacement'
		);
	});

	it('returns the message from chrome.i18n', () => {
		const result = $helperbird_i18n('saved');
		expect(result).toBe('saved');
	});
});

describe('isChrome', () => {
	it('returns true for Chrome user agent', () => {
		expect(
			isChrome(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
				'Google Inc.'
			)
		).toBe(true);
	});

	it('returns false for Firefox user agent', () => {
		expect(
			isChrome(
				'Mozilla/5.0 (Windows NT 10.0; rv:120.0) Gecko/20100101 Firefox/120.0',
				''
			)
		).toBe(false);
	});
});

describe('isFirefox', () => {
	it('returns true for Firefox user agent', () => {
		expect(
			isFirefox(
				'Mozilla/5.0 (Windows NT 10.0; rv:120.0) Gecko/20100101 Firefox/120.0'
			)
		).toBe(true);
	});

	it('returns false for Chrome user agent', () => {
		expect(isFirefox('Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36')).toBe(
			false
		);
	});
});

describe('isEdge', () => {
	it('returns true for Edge user agent', () => {
		expect(
			isEdge(
				'Mozilla/5.0 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
			)
		).toBe(true);
	});

	it('returns false for Chrome user agent', () => {
		expect(isEdge('Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36')).toBe(
			false
		);
	});
});

describe('isSafari', () => {
	it('returns true for Safari user agent', () => {
		expect(
			isSafari(
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605.1.15'
			)
		).toBe(true);
	});

	it('returns false for Chrome user agent (contains Safari string)', () => {
		expect(
			isSafari(
				'Mozilla/5.0 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
			)
		).toBe(false);
	});
});

describe('getBrowser', () => {
	const originalNavigator = global.navigator;

	afterEach(() => {
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			writable: true
		});
	});

	it('returns firefox for Firefox user agent', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent: 'Mozilla/5.0 Firefox/120.0',
				vendor: ''
			},
			writable: true
		});
		expect(getBrowser()).toBe('firefox');
	});

	it('returns chrome as default fallback', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent: 'Unknown Browser',
				vendor: ''
			},
			writable: true
		});
		expect(getBrowser()).toBe('chrome');
	});
});
