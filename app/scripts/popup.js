import { $helperbird_i18n } from '@scripts/content/utils';
import { createApp } from 'vue';
import Toaster from '@meforma/vue-toaster';
import App from '@scripts/app.vue';

const app = createApp(App);

app.provide('$helperbird_i18n', $helperbird_i18n);

app.use(Toaster, {
	position: 'bottom',
	queue: false,
	pauseOnHover: true,
	maxToasts: 1,
	duration: 3000,
	style: {
		'background': '',
		'border-radius': '30px'
	}
});

app.config.productionTip = true;

app.mount('#app');
