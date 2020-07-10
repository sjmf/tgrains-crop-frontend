// actions.js

import state from "@/store/state";
import http from "@/services/http";
import store from "@/store/index";

export default {
    /***
     * Load the Business-as-usual state from the server
     * @returns {Promise<void>}
     */
    async loadBauState() {
        // If BAU object is empty, go get it
        let bau = state.bau[state.landscape_id]
        if (Object.keys(bau).length === 0 && bau.constructor === Object) {
            console.log('Loading Strings and BAU state');
            try {
                const strings = await http.loadStrings(state.landscape_id)
                this.commit("setStrings", strings)

                bau = await http.loadBAUState(state.landscape_id)
                this.commit("setBAUState", bau)
            } catch (err) {
                console.log(err)
                this.commit("raiseError", err)
            }

            // Populate Landscapes in Vuex using strings and cropAreas from BAU state
            this.commit('populate')
        }
    },

    /***
     * Query the model using the parameters
     * @returns {Promise<void>}
     */
    async queryModel() {
        this.commit('closeError')

        // Prepare data from store for the API
        const data = { 'landscape_id': store.state.landscape_id }
        const crops = Object.values(store.state.landscapes[store.state.landscape_id].crops)
            .map(item => ({[item.name]: item.value}))
        const livestock = Object.values(store.state.landscapes[store.state.landscape_id].livestock)
            .map(item => ({[item.name]: item.value}))
        Object.assign(data, ...crops, ...livestock)

        try {
            const result = await http.queryModel(data)
            this.commit("setDataFromQuery",result)
        }
        catch (err) {
            this.commit("raiseError", err)
        }
    }
}