import Vue from 'vue';
import App from './components/app.vue';
import { Notyf } from 'notyf';
import i18n from 'vue-plugin-webextension-i18n';
import 'vue-select/dist/vue-select.css';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte
import 'vue-select/dist/vue-select.css';
Vue.use(i18n);
Vue.config.productionTip = false;

new Vue({
	provide: () => {
		return {
			notyf: new Notyf({
				duration: 2000,
				dismissible: true,
				position: {
					x: 'right',
					y: 'bottom'
				}
			})
		};
	},
	el: '#app',
	render: (h) => h(App)
});
