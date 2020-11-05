import Vue from 'vue'
import App from './App.vue'
import store from './store'

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

  mounted: function() {
    // M.AutoInit();
    // Initialise MaterializeCSS elements individually instead:
    this.$_M.Tabs.init(document.querySelectorAll(".tabs"), {
      // swipeable: true
    });

    this.$_M.Modal.init(document.querySelectorAll(".modal"))

    this.$_M.Sidenav.init(document.querySelectorAll(".sidenav"))

    // Tooltips do not work because sidebar data is loaded later, via an ajax request.
    //M.Tooltip.init(document.querySelectorAll('.sidenav li.variable-row[data-tooltip]:not([data-tooltip=""]'))

    this.$_M.Collapsible.init(document.querySelectorAll(".collapsible"))

    // Open modal if terms not accepted.
    // This lives here because we can't re-import Materialize in components
    if(store.state.acceptedTerms === false) {
      const elem = document.querySelector("#modal-welcome")
      this.$_M.Modal.getInstance(elem).open();
    }

    this.$nextTick(()=> {
        // We need to initialise the dropdown on $nextTick because
        //  its value (101/102) is loaded from vuex in LandAreaMenu
        this.$_M.FormSelect.init(
            document.querySelector('#landscape-input select')
        )
    })
  },

  store,

  data: function() {
    return {
      title: 'T-GRAINS Crop Model',
    }
  }
}).$mount('#app')
