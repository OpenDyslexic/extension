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
		created: function() {
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
				if (this.value) {
					this.text = "On"
				} else {
					this.text = "Off"
				}

				chrome.storage.sync.set({
					enabled: this.value
				}, function() {
					reloadPage();
				});
			},
            /*
            * load settings function
            */
			loadSettings: function() {
				console.log("ssss");
				chrome.storage.sync.get("enabled", function(items) {
					this.value = items.enabled
					if (items.enabled) {
						this.text = "Off"
					} else {
						this.text = "On"
					}
				});
			}
		}
	});
}


window.onload = function() {
	function reloadPage() {
		chrome.tabs.getSelected(null, function(tab) {
			var code;
			code = 'window.location.reload();';
			chrome.tabs.executeScript(tab.id, {
				code: code
			});
		});
	}
	new Vue({
		el: '#frames',
		data: {
			text: "Off",
			value: false
		},
		created: function() {
			this.loadSettings();
		},
		methods: {
			changeSetting: function() {
				console.log(this.value);
				if (this.value) {
					this.text = "Off"
				} else {
					this.text = "On"
				}
				chrome.storage.sync.set({
					enabled: this.value
				}, function() {
					reloadPage();
				});
			},
			loadSettings: function() {
				console.log("ssss");
				chrome.storage.sync.get("enabled", function(items) {
					this.value = items.enabled
					if (items.enabled) {
						this.text = "Off"
					} else {
						this.text = "On"
					}
					console.log(items);
				});
			}
		}
	});
}