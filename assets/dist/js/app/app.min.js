window.onload = function() {
	/*
	 * Reload the tab
	 */
	function reloadPage() {
		chrome.tabs.getSelected(null, function(tab) {
			var code;
			code = 'window.location.reload();';
			chrome.tabs.executeScript(tab.id, {
				code: code
			});
		});
	}
	/*
	 * Load Vue
	 */
	new Vue({
		el: '#frames',
		data: {
			text: "Off",
			value: false
		},
		mounted: function() {
			this.loadSettings();
		},
		/*
		 * Functions
		 */
		methods: {
			/*
			 * Change settings
			 */
			changeSetting: function() {
				var self = this;
                var boolean = this.value;
				chrome.storage.sync.set({
					"enabled": self.value
				}, function() {
                    console.log(boolean);
					if (self.value) {
						console.log(self.value);
                        self.value = true;
						self.text = "On"
					} else {
						console.log(self.value);
						self.text = "Off"
                         self.value = false;
					}
					reloadPage();
				});
                console.log(this.value);
			},
			/*
			 * load settings function
			 */
			loadSettings: function() {
				var self = this;
				chrome.storage.sync.get("enabled", function(items) {
					self.value = items.enabled;

					if (items.enabled) {
						self.text = "On";
                         self.value = true;
					} else {
						self.text = "Off";
                         self.value = false;
					};
                    reloadPage();
				});
                console.log(this.value);
			}
		}
	});
}