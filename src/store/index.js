// index.js

import { createStore } from 'vuex'

// Persist all data in the browser's local storage
import createPersistedState from 'vuex-persistedstate'
import createCache from 'vuex-cache'

import state from './state'
import mutations from './mutations'
import actions from './actions'

/***
 * Vuex data store. Global variables for the UI live here.
 */
export default createStore({
    strict: !import.meta.env.PROD,
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