export function $helperbird_i18n(params, replace = null) {
	return typeof browser !== 'undefined'
		? browser.i18n.getMessage(params, replace)
		: chrome.i18n.getMessage(params, replace);
}

export function getBrowser() {
	if (isFirefox()) return 'firefox';
	if (isEdge()) return 'edge';
	if (isChrome()) return 'chrome';
	if (isSafari()) return 'safari';
	return 'chrome';
}

export function isFirefox(agent) {
	const userAgent = agent || navigator.userAgent;
	return /firefox/i.test(userAgent);
}

export function isEdge(agent) {
	const userAgent = agent || navigator.userAgent;
	return /Edg/i.test(userAgent);
}

export function isSafari(agent) {
	const userAgent = agent || navigator.userAgent;
	return /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
}

export function isChrome(agent, vendor) {
	const userAgent = agent || navigator.userAgent;
	const vendorAgent = vendor || navigator.vendor;
	return /Chrome/.test(userAgent) && /Google Inc/.test(vendorAgent);
}

export function isEmpty(value) {
	return value == null || value === '';
}

export const MAX_EXCLUDED_SITES = 5;

/**
 * Reduce anything the user might paste in - a full URL, a host with a port,
 * a leading www. - down to a bare, comparable hostname.
 */
export function normaliseHost(value) {
	if (isEmpty(value)) {
		return '';
	}

	return String(value)
		.trim()
		.toLowerCase()
		.replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
		.split('/')[0]
		.split('?')[0]
		.split('#')[0]
		.split(':')[0]
		.replace(/^www\./, '');
}

/**
 * A site is excluded when it matches an entry exactly or is a subdomain of
 * one, so excluding 'example.com' also covers 'docs.example.com'.
 */
export function isExcluded(hostname, excludedSites) {
	const host = normaliseHost(hostname);

	if (isEmpty(host) || !Array.isArray(excludedSites)) {
		return false;
	}

	return excludedSites.some((entry) => {
		const site = normaliseHost(entry);
		return !isEmpty(site) && (host === site || host.endsWith(`.${site}`));
	});
}
