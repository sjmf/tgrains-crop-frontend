import Vue from 'vue'
import App from './App.vue'

import store from './store'

import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

import Material from 'materialize-css'
import M from 'materialize-css'

import 'typeface-roboto';
import 'material-icons';

require('@/css/app.scss');
require('@/css/styles.css');

Vue.use(Material);

Vue.config.productionTip = false


new Vue({
  render: h => h(App),

  mounted: function() {
    M.AutoInit();    // Initialise MaterializeCSS elements

    // Open modal if terms not accepted.
    // This lives here because we can't re-import Materialize in components
    if(store.state.acceptedTerms === false) {
      let elem = document.querySelector("#modal-welcome")
      M.Modal.getInstance(elem).open();
    }
  },

  store,

  data: function() {
    return {
      title: 'T-GRAINS Crop Model',
    }
  }
}).$mount('#app')
