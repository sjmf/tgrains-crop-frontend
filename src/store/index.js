// index.js

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Persist all data in the browser's local storage
import createPersistedState from 'vuex-persistedstate'
import createCache from 'vuex-cache'

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
        createPersistedState({
            key: 'vuex',
            reducer: (state) => {
                let reducer = Object.assign({}, state)
                // Paths to discard from store:
                delete reducer.messages     // Don't reload messages
                return (reducer)
            },
            filter: (mutation) => {
                let exclude = ['setMessage']
                return ! exclude.includes(mutation.type)
            }
        }),
        createCache()
    ]
})