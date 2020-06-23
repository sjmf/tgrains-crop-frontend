import axios from "axios"

import store from '../store';

export default {
    sleep(sleepMs){
        let res;
        setTimeout(function(){ res(); }, sleepMs);
        return new Promise(function(a){ res = a; });
    },

    async queryModel () {
        try {
            // Prepare data from store for the API
            const data = { landscape_id: store.state.landscape_id }
            const crops = Object.values(store.state.crops)
                    .map(item => ({[item.name]: item.value}))
            const livestock = Object.values(store.state.livestock)
                    .map(item => ({[item.name]: item.value}))
            Object.assign(data, ...crops, ...livestock)

            // Query the model and kick off celery task
            let response = await axios.post('/model', data)
            const pathname = new URL(response.request.responseURL).pathname
            console.log(pathname)
            console.log(response)

            // Keep checking the celery status if result is deferred, e.g. state= "PENDING", "STARTED", or "RETRY"
            while (!(['SUCCESS', 'FAILURE', 'REVOKED'].includes(response.data.state))) {
                await this.sleep(250)
                console.log("Awake! Checking state again...")

                response = await axios.get(pathname)
                console.log(response)
            }

            if(response.data.state === 'SUCCESS') {
                store.commit("setDataFromQuery", response.data.result);
                return true
            } else {
                console.err(response.data);
                throw "The crop model is in state '" + response.data.state + "'"
            }
        }
        catch (err) {
            console.error(err);
            store.commit("raiseError", err)
            return false
        }
    },

    async loadBAUState () {
        console.warn("TODO: Implement BAU State Load!")
        const response = await axios.get(
            '/model',
            {
                params: {
                    'landscapeId': store.state.landscape_id
                }
            }
        );
        console.log(response);
        return response.data;
    }
}