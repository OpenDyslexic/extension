window.onload = function () {
	new Vue({
		el: '#frames',
		data: {
			enabled: false
		},
		methods: {
			reloadPage: function () {
				chrome.tabs.getSelected(null, function (tab) {
					chrome.tabs.reload(tab.id);
				});
			},
			changeSetting: function () {
				var self = this;
				this.enabled = !this.enabled;
				chrome.storage.sync.set({
					"enabled": this.enabled
				}, function () {
					self.reloadPage();
				});
			},
			loadSettings: function () {
				var self = this;
				chrome.storage.sync.get("enabled", function (items) {
					self.enabled = items.enabled;
				});
			}
		},
		computed: {
			text: function () {
				return this.enabled ? "On" : "Off";
			}
		},
		ready: function () {
			this.loadSettings();
		}
	});
};