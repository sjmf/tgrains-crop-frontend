import axios from "axios"

export default {
    /***
     * Helper function: use Promise to implement sleep()
     * @param sleepMs
     * @returns {Promise<unknown>}
     */
    sleep (sleepMs) {
        let res
        setTimeout(function(){ res() }, sleepMs)
        return new Promise(function(a){ res = a; })
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
            await this.sleep(500)
            console.log("Awake! Checking state again...")

            response = await axios.get(pathname)
            console.log(response)
        }

        if(response.data.state === 'SUCCESS') {
            return response
        } else {
            console.error(response.data)
            throw "The crop model state is '" + response.data.state + "'"
        }
    },

    /***
     * POST a query to the model, await response, and commit result to the Vuex store
     * @param data - formatted data for POSTing
     * @returns {Promise<boolean>}
     */
    async queryModel (data) {
        try {
            // Query the model and kick off celery task
            let response = await axios.post('/model', data)
            console.log(response)

            response = await this.checkCeleryStatus(response)
            return response.data.result
        }
        catch (err) {
            console.error(err);
            throw "Model query failed. " + err.toString() || ""
        }
    },

    /***
     * Load the Business As Usual state into the Vuex store
     * @returns {Promise<void>}
     */
    async loadBAUState (landscape_id) {
        try {
            const data = {params: {'landscape_id': landscape_id}}

            let response = await axios.get('/model', data)
            response = await this.checkCeleryStatus(response)

            console.info("BAU State Loaded!")
            return response.data.result
        }
        catch (err) {
            console.log(err)
            throw "Loading business-as-usual state failed. " + err.toString() || ""
        }
    },

    /***
     * Load strings for crop identifiers
     * @returns {Promise<void>}
     */
    async loadStrings (landscape_id) {
        try {
            const data = {params: {'landscape_id': landscape_id}}

            let response = await axios.get('/strings', data)
            response = await this.checkCeleryStatus(response)

            console.info("Crop & Livestock Strings Loaded!")
            return response.data.result
        }
        catch (err) {
            console.log(err)
            throw "Loading strings failed. " + err.toString() || ""
        }
    },

    /**
     * Load comments from the database.
     *
     * Route: /comment?page=1&size=10
     * Method: GET
     *
     * Get comments from the database in paginated form. The following params control the pagination:
     *
     * • page: Integer. The page to load.
     * • size: Integer. The size of a page.
     *
     * Comments are returned as JSON.
     *
     * NB: Page counter starts at 1. Requesting page 0 results in 404 not found (from flask-sqlalchemy)
     *
     * @param page
     * @param size
     * @returns {Promise<any>}
     */
    async loadComments(page, size) {
        try {
            const data = {params: {'page': page, 'size': size}}

            let response = await axios.get('/comment', data)

            console.info("Loaded comments!")
            console.debug(response)
            return response.data
        }
        catch (err) {
            console.log(err)
            throw "Loading comments failed. " + err.toString() || ""
        }
    },

    /**
     * Post a comment
     * Route: /comment?page=1&size=10
     * Method: POST
     *
     * Post a comment to the model, to be stored in the database. POST body MUST include the below variables, formatted as
     * JSON.
     *
     * • text: String. The comment body.
     * • author: String. The author's name.
     * • email: String. The author's email address (may be NULL for social media login)
     *
     * POST body MAY also include the following variable:
     *
     * • reply_id: Integer. The comment that this comment is replying to.
     *
     * @param data
     * @returns {Promise<*>}
     */
    async postComment(data) {
        try {
            let response = await axios.post('/comment', data)
            console.log(response)

            return response.data
        }
        catch (err) {
            console.error(err);
            throw "Model query failed. " + err.toString() || ""
        }
    }
}