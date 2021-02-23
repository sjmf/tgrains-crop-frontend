import Vue from 'vue'
import App from './App.vue'

// Import fragment plugin for multi-root components
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

// Import Axios for HTTP AJAX requests
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Import Materialize library for UI and attach it to the Vue prototype
import Material from 'materialize-css'
import M from 'materialize-css'
Vue.use(Material);
Vue.prototype.$_M = M

import 'typeface-roboto';
import 'material-icons';

require('@/css/app.scss');
require('@/css/styles.css');

// Import and set up smooth scrolling
import VueSmoothScroll from 'vue2-smooth-scroll'
Vue.use(VueSmoothScroll, {
  duration: 400,
  updateHistory: false,
})

// Import the vue router
import router from './router'

/// Disable “development mode” warning
// Vue.config.productionTip = false

// Setup vue
new Vue({
  render: h => h(App),
  router,

  data: function() {
    return {
      title: 'T-GRAINS Crop Model',
    }
  }
}).$mount('#app')
