let storageChangeListener;

beforeEach(() => {
	jest.clearAllMocks();

	chrome.storage.onChanged.addListener.mockImplementation((listener) => {
		storageChangeListener = listener;
	});

	chrome.storage.local.get.mockImplementation((keys, callback) => {
		if (callback) {
			const result = {};
			if (Array.isArray(keys)) {
				keys.forEach((key) => {
					result[key] = undefined;
				});
			}
			callback(result);
		}
		return Promise.resolve({ found: false, item: '' });
	});

	jest.isolateModules(() => {
		require('../../app/scripts/background/index');
	});
});

describe('background initialization', () => {
	it('registers storage change listener', () => {
		expect(chrome.storage.onChanged.addListener).toHaveBeenCalled();
	});

	it('loads initial enabled state from storage', () => {
		expect(chrome.storage.local.get).toHaveBeenCalledWith(
			['enabled'],
			expect.any(Function)
		);
	});

	it('sets initial badge state from storage', () => {
		expect(chrome.action.setBadgeBackgroundColor).toHaveBeenCalled();
		expect(chrome.action.setBadgeText).toHaveBeenCalled();
	});
});

describe('storage change handling', () => {
	it('ignores changes from non-local/sync areas', async () => {
		await storageChangeListener({ enabled: { newValue: true } }, 'managed');
		expect(chrome.tabs.query).not.toHaveBeenCalled();
	});

	it('sends message to all tabs when enabled changes', async () => {
		chrome.storage.local.get.mockImplementation((key) =>
			Promise.resolve({ [key]: undefined })
		);
		chrome.tabs.query.mockImplementation((query, callback) => {
			callback([{ id: 1 }, { id: 2 }]);
		});

		await storageChangeListener({ enabled: { newValue: true } }, 'local');

		expect(chrome.tabs.query).toHaveBeenCalled();
	});

	it('sends message to all tabs when font changes', async () => {
		chrome.storage.local.get.mockImplementation((key) =>
			Promise.resolve({ [key]: undefined })
		);
		chrome.tabs.query.mockImplementation((query, callback) => {
			callback([{ id: 1 }]);
		});

		await storageChangeListener({ font: { newValue: 'bold' } }, 'local');

		expect(chrome.tabs.query).toHaveBeenCalled();
	});

	it('sends message to all tabs when excluded sites change', async () => {
		chrome.storage.local.get.mockImplementation((key) =>
			Promise.resolve({ [key]: undefined })
		);
		chrome.tabs.query.mockImplementation((query, callback) => {
			callback([{ id: 1 }]);
		});

		await storageChangeListener(
			{ excludedSites: { newValue: ['example.com'] } },
			'local'
		);

		expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
			1,
			expect.objectContaining({
				type: 'updateExcludedSites',
				excludedSites: ['example.com']
			})
		);
	});

	it('updates badge when enabled changes', async () => {
		jest.clearAllMocks();
		chrome.storage.local.get.mockImplementation((key) =>
			Promise.resolve({ [key]: undefined })
		);

		await storageChangeListener({ enabled: { newValue: true } }, 'local');

		expect(chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith(
			{ color: '#34c759' },
			expect.any(Function)
		);
		expect(chrome.action.setBadgeText).toHaveBeenCalledWith(
			{ text: 'on' },
			expect.any(Function)
		);
	});
});
