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

/// Disable “development mode” warning
Vue.config.productionTip = false

// Setup vue
new Vue({
  render: h => h(App),

  /** Actions which occur on page-load **/
  mounted: function() {
    // M.AutoInit();
    // Initialise MaterializeCSS elements individually instead:
    this.$_M.Tabs.init(document.querySelectorAll(".tabs"), {
      // swipeable: true
    });

    // Initialise Materialize components
    // One day, this should all be re-written with Vuetify...
    this.$_M.Modal.init(document.querySelectorAll(".modal"))
    this.$_M.Sidenav.init(document.querySelectorAll(".sidenav"))
    this.$_M.Collapsible.init(document.querySelectorAll(".collapsible"))
    // NB: Tooltips are not initialised here because sidebar data is loaded later, via an ajax request.
    // Check App.vue:93 initialiseTooltips() for tooltip initialisation

    this.$nextTick(()=> {
        // We need to initialise the dropdown on $nextTick because
        //  its value (101/102) is loaded from vuex in LandAreaMenu
        this.$_M.FormSelect.init(
            document.querySelector('#landscape-input select')
        )
    })
  },

  data: function() {
    return {
      title: 'T-GRAINS Crop Model',
    }
  }
}).$mount('#app')
