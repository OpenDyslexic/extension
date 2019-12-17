import Vue from 'vue';
import App from './components/app.vue';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'material-icons/iconfont/material-icons.css';

Vue.config.productionTip = false;

import VueMaterial from "vue-material";


Vue.use(VueMaterial);

new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
});