import Vue from 'vue'
import App from './App.vue'

import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

import Material from 'materialize-css'
import M from 'materialize-css'
import 'materialize-css/dist/js/materialize.min.js';

import 'typeface-roboto';
import 'material-icons';
import store from './store'

require('@/css/app.scss');
require('@/css/styles.css');

Vue.use(Material);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),

  mounted: function() {
    M.AutoInit();    // Initialise MaterializeCSS elements
  },

  store,

  data: function() {
    return {
      title: 'T-GRAINS Crop Model',
    }
  }
}).$mount('#app')
