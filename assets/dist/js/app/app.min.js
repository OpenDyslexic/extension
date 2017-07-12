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
			 * reload the page
			 */
			reloadPage: function() {
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.reload(tab.id);
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
					self.reloadPage();
				});
			},
			/*
			 * load settings function
			 */
			loadSettings: function() {
				var self = this;
				chrome.storage.sync.get("enabled", function(items) {
					self.enabled = items.enabled;
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