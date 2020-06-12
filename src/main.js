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
      bau_crop_areas: {
        wheat:       1000*0.360008,
        barley:      1000*0.15023,
        oats:        1000*0.017609,
        osr:         1000*0.093017,
        veg:         1000*0.033853,
        maize:       1000*0.023679,
        peas:        1000*0.005563,
        potatoes:    1000*0.029903,
        softfruit:   1000*0.001223,
        topfruit:    1000*0.001396,
        sugarbeet:   1000*0.057514,
        dairy:       1000*0.014541,
        beef:        1000*0.051775,
        chicken:     1000*0.012746,
        pork:        1000*0.119824,
        eggs:        1000*0.016481,
        lamblowland: 1000*0.010638,
        lambupland:  1000*0
      }
    }
  }
}).$mount('#app')
