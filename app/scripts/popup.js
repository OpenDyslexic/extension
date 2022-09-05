import Vue from 'vue';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import App from './app.vue';
import { sendToContentScript } from './content/api';
import { $helperbird_i18n } from './utils';

Vue.config.productionTip = true;
Vue.component('v-select', VueSelect);

new Vue({
	provide: () => {
		return {
			$helperbird_i18n: $helperbird_i18n,
			sendToContentScript: sendToContentScript
		};
	},
	el: '#app',

	render: (h) => h(App)
});
