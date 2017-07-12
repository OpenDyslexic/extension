window.onload = function() {
	/*
	 * Load Vue
	 */
	new Vue({
		el: '#frames',
		data: {
			enabled: false
		},
		/*
		 * Functions
		 */
		methods: {
			/*
			 * Reload the tab
			 */
			reloadPage: function() {
				chrome.tabs.getSelected(null, function(tab) {
					var code = 'window.location.reload();';
					chrome.tabs.executeScript(tab.id, {
						code: code
					});
				});
			},
			/*
			 * Change settings
			 */
			changeSetting: function() {
				var self = this;
				this.enabled = !this.enabled;
				chrome.storage.sync.set({
					"enabled": this.enabled
				}, function() {
					this.reloadPage();
				});
			},
			/*
			 * load settings function
			 */
			loadSettings: function() {
				var self = this;
				chrome.storage.sync.get("enabled", function(items) {
					self.value = items.enabled;
				});
			}
		},
		computed: {
			text: function() {
				return this.enabled ? "On" : "Off";
			}
		},
		ready: function() {
			/*
			 * Load the settings function
			 */
			this.loadSettings();
		}
	});
};