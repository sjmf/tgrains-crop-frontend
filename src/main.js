import { createApp } from 'vue'
import App from './App.vue'

// Import Axios for HTTP AJAX requests
import axios from 'axios'
import VueAxios from 'vue-axios'

// Import Materialize library for UI
import M from 'materialize-css'

import 'typeface-roboto';
import 'material-icons/iconfont/filled.css';

import '@/css/app.scss';
import '@/css/styles.css';

// Import the vue router and data store
import router from './router'
import store from './store'

// Setup vue
const app = createApp(App)

app.use(router)
app.use(store)
app.use(VueAxios, axios)

// Attach Materialize to every component as this.$_M
app.config.globalProperties.$_M = M

// Mount once the initial route has resolved: App.vue reads $route.params on mount
router.isReady().then(() => app.mount('#app'))
