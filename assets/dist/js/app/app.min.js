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
                if (this.value == true) {
                    console.log(this.value);
					this.text = "On"
				} else {
                    console.log(this.value);
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
	
				chrome.storage.sync.get("enabled", function(items) {
					this.value = items.enabled
                    console.log(this.value + "button");
                    enabled = items.enabled;

			        console.log(items.enabled);

                		if (items.enabled == true) {
						this.text = "On";
                        this.value = items.enabled;
					} else {
						this.text = "Off";
                        this.value = items.enabled;
					};
				});
        
			}
		}
	});
}