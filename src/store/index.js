// index.js

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Persist all data in the browser's local storage
import createPersistedState from 'vuex-persistedstate'

import state from './state'
import mutations from './mutations'
import actions from './actions'

/***
 * Vuex data store. Global variables for the UI live here.
 */
export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state,
    mutations,
    actions,
    modules: {},
    plugins: [
        createPersistedState({key: 'vuex'})
    ]
})