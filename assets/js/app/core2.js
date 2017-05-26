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
				console.log("111");
				console.log(boolean);
				if (boolean){
					boolean = false;
				}else {
					boolean = true;
				}

				chrome.storage.sync.set({
					"enabled": boolean
				}, function() {
                    console.log(boolean);
					if (boolean) {
	
						self.text = "On"
					} else {
				
						console.log(boolean);
        
						self.text = "Off"
               
					}
					reloadPage();
				});
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
				});
                console.log(this.value);
			}
		},
		ready: function() {
			console.log("batmaniscool");
			this.loadSettings();
		},
	});
}