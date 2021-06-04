import Vue from 'vue';
import VueUi from '@vue/ui';
import VueI18n from 'vue-i18n';
import { upperFirst, camelCase } from 'lodash';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { formatTs } from '@/helpers/utils';
import messages from '@/helpers/messages.json';
import numberFormats from '@/helpers/number.json';
import VueParticles from 'vue-particles';
import ToggleSwitch from 'vuejs-toggle-switch';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import VueCountdown from '@chenfengyuan/vue-countdown';
import numeral from 'numeral';

import '@/style.scss';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.use(ToggleSwitch);
Vue.use(VueParticles);
Vue.use(VueUi);
Vue.use(VueI18n);
Vue.component('vue-countdown', VueCountdown);

const i18n = new VueI18n({ locale: 'en', messages, numberFormats });

const requireComponent = require.context('@/components', true, /[\w-]+\.vue$/);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')));
  Vue.component(componentName, componentConfig.default || componentConfig);
});

Vue.filter('formatTs', value => formatTs(value));
Vue.filter('formatInteger', function(value) {
  return numeral(value).format('0'); // displaying other groupings/separators is possible, look at the docs
});
Vue.filter('formatNumber', function(value) {
  return numeral(value).format('0,0.00'); // displaying other groupings/separators is possible, look at the docs
});

Vue.filter('formatLP', function(value) {
  return numeral(value).format('0,0.0000'); // displaying other groupings/separators is possible, look at the docs
});

Vue.filter('formatCurrency', function(value) {
  return numeral(value).format('$0,0.00'); // displaying other groupings/separators is possible, look at the docs
});

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
