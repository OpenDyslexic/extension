import { $helperbird_i18n } from '@scripts/content/utils';
import { createApp } from 'vue';
import App from '@scripts/app.vue';

const app = createApp(App);

app.provide('$helperbird_i18n', $helperbird_i18n);

app.mount('#app');
