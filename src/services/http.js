import axios from "axios"

import store from '../store';

export default {
    /***
     * Helper function: use Promise to implement sleep()
     * @param sleepMs
     * @returns {Promise<unknown>}
     */
    sleep (sleepMs) {
        let res;
        setTimeout(function(){ res(); }, sleepMs);
        return new Promise(function(a){ res = a; });
    },

    /***
     * Check the /status/<job_id> route for the return from the Celery task queue
     * @param response
     * @returns {Promise<*>}
     */
    async checkCeleryStatus (response) {
        const pathname = new URL(response.request.responseURL).pathname
        console.log(pathname)

        // Keep checking the celery status if result is deferred, e.g. state= "PENDING", "STARTED", or "RETRY"
        while (!(['SUCCESS', 'FAILURE', 'REVOKED'].includes(response.data.state))) {
            await this.sleep(250)
            console.log("Awake! Checking state again...")

            response = await axios.get(pathname)
            console.log(response)
        }

        if(response.data.state === 'SUCCESS') {
            return response
        } else {
            console.error(response.data);
            throw "The crop model is in state '" + response.data.state + "'"
        }
    },

    /***
     * POST a query to the model, await response, and commit result to the Vuex store
     * @returns {Promise<boolean>}
     */
    async queryModel () {
        try {
            // Prepare data from store for the API
            const data = { 'landscape_id': store.state.landscape_id }
            const crops = Object.values(store.state.landscapes[store.state.landscape_id].crops)
                    .map(item => ({[item.name]: item.value}))
            const livestock = Object.values(store.state.landscapes[store.state.landscape_id].livestock)
                    .map(item => ({[item.name]: item.value}))
            Object.assign(data, ...crops, ...livestock)

            // Query the model and kick off celery task
            let response = await axios.post('/model', data)
            console.log(response)

            response = await this.checkCeleryStatus(response);
            store.commit("setDataFromQuery", response.data.result);
        }
        catch (err) {
            console.error(err);
            throw "Model query failed"
        }
    },

    /***
     * Load the Business As Usual state into the Vuex store
     * @returns {Promise<void>}
     */
    async loadBAUState () {
        try {
            const data = {params: {'landscape_id': store.state.landscape_id}}

            let response = await axios.get('/model', data);
            response = await this.checkCeleryStatus(response);

            store.commit("setBAUState", response.data.result)
            console.info("BAU State Loaded!")
        }
        catch (err) {
            console.log(err)
            throw "Loading business-as-usual state failed."
        }
    },

    /***
     * Load strings for crop identifiers
     * @returns {Promise<void>}
     */
    async loadStrings () {
        try {
            const data = {params: {'landscape_id': store.state.landscape_id}}

            let response = await axios.get('/strings', data);
            response = await this.checkCeleryStatus(response);

            store.commit("setStrings", response.data.result)
            console.info("Crop & Livestock Strings Loaded!")
        }
        catch (err) {
            console.log(err)
            throw "Loading strings failed."
        }
    }
}