import { sendToContentScript } from '@scripts/content/api';
import { $helperbird_i18n } from '@scripts/content/utils';
import { createApp } from "vue";
import Toaster from "@meforma/vue-toaster";
import App from "@scripts/app.vue";

const app = createApp(App);

app.provide("$helperbird_i18n", $helperbird_i18n);
app.provide("sendToContentScript", sendToContentScript);
app.use(Toaster, {
  position: "bottom",
  duration: 4000,
  dismissible: false,
});

app.config.productionTip = true;

app.mount("#app");
