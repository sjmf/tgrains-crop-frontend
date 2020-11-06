// actions.js

import { cacheAction } from "vuex-cache";
import http from "@/services/http";

export default {
    /***
     * Load the Business-as-usual state from the server
     * @returns {Promise<void>}
     */
    async loadBauState() {
        // If BAU object is empty, go get it
        let bau = this.state.bau[this.state.landscape_id]

        if (Object.keys(bau).length === 0 && bau.constructor === Object) {
            console.log("Loading Strings and BAU state")
            try {
                const strings = await http.loadStrings(this.state.landscape_id)
                this.commit("setStrings", strings)

                bau = await http.loadBAUState(this.state.landscape_id)
                this.commit("setBAUState", bau)

                // Populate Landscapes in Vuex using strings and cropAreas from BAU state
                this.commit("populate")
                this.dispatch("sumArea")

                // Create new session and push initial state onto history stack (including BAU tag [1])
                await this.dispatch('newSession')
                this.commit("pushHistory", [1])
            } catch (err) {
                console.error(err)
                this.commit("raiseError", err)
            }
        }
    },

    /***
     * Grab the payload, dispatch the query, store the result.
     * @returns {Promise<void>}
     */
    async queryModel() {
        // Close error message in preparation
        this.commit("clearMessages")

        // Prepare payload...
        let payload = await this.dispatch("getPayload")

        try {
            // ... and send to API!
            // to cache: await this.cache.dispatch("doCachedModelQuery", payload)
            await this.dispatch("doModelQuery", payload)
                .then((result)=>{
                    this.commit("setDataFromQuery", result)
                    // Push new state onto history stack
                    this.commit("pushHistory")
                    // Activate tags for this query (must run after history push as uses state)
                    this.commit("activateTags", 0)
                })
        } catch (err) {
            console.error(err)
            this.commit("raiseError", err)
        }

        //console.info("Cached?", this.cache.has("doCachedModelQuery", payload))
    },

    /**
     * Calculate the total area used by crops within the current state
     * @returns {Number}
     */
    sumArea() {
        // Handle not-yet-loaded data edge-case
        if(Object.keys(this.state.landscapes[this.state.landscape_id]).length === 0)
            this.commit("setTotalArea", 0)

        // Sum crop and livestock areas using .values().reduce()
        let cropArea = Object.values(this.state.landscapes[this.state.landscape_id].crops)
            .reduce((acc, cur)=> acc + Math.abs(cur.value || 0), 0)
        let livestockArea = Object.values(this.state.landscapes[this.state.landscape_id].livestock)
            .reduce((acc, cur)=> acc + Math.abs(cur.value || 0), 0)

        this.commit("setTotalArea", cropArea + livestockArea)
    },

    /**
     * Construct and return payload for model queries
     * @returns {Object}
     */
    getPayload() {
        const payload = {'landscape_id': this.state.landscape_id}
        const crops = Object.values(this.state.landscapes[this.state.landscape_id].crops)
            .map(item => ({[item.name]: parseInt(item.value)}))
        const livestock = Object.values(this.state.landscapes[this.state.landscape_id].livestock)
            .map(item => ({[item.name]: parseInt(item.value)}))

        return Object.assign(payload, ...crops, ...livestock)
    },

    /***
     * Query the model using the payload provided. Payload is used as cache key.
     * @returns {Promise<void>}
     */
    'doCachedModelQuery': cacheAction(
        // eslint-disable-next-line no-unused-vars
        ({ _, commit }, payload) => {

            try {
                return http.queryModel(payload)
            }
            catch (err) {
                commit("raiseError", err)
            }
    }),

    /***
     * Query the model without caching
     * @returns {Promise<void>}
     */
    doModelQuery (state, payload) {
        try {
            return http.queryModel(payload)
        }
        catch (err) {
            this.commit("raiseError", err)
        }
    },

    /***
     * Check the vuex state against the version hash and replace if changed
     */
    checkVersion() {
        if(this.state.versionHash !== process.env.VUE_APP_GIT_HASH) {
            console.warn(this.state.versionHash, '=>', process.env.VUE_APP_GIT_HASH)
            this.commit("resetVuexDefaults")
            console.warn(`Vuex store reloaded from defaults due to new version hash: '${process.env.VUE_APP_GIT_HASH}'`)
        }
    },

    /***
     * Retrieve comments from the server and load them into vuex
     */
    async loadComments() {
        try {
            let comments = await http.loadComments(this.state.comments.page, this.state.comments.size)
            this.commit("setComments", comments)
        }
        catch (err) {
            this.commit("raiseError", err)
        }
    },

    /**
     * Retrieve tags (and groups) from server and load into vuex
     * @returns {Promise<void>}
     */
    async loadTags() {
        let tagData = await http.loadTags()
        this.commit("setTags", tagData)
    },

    /***
     * Post a comment
     * @param _ unused state
     * @param payload
     * @returns {Promise<void>}
     */
    async postComment(_, payload) {
        this.commit("saveNameAndEmail", {name: payload['author'], email: payload['email']})
        try {
            payload['page'] = this.state.comments.page
            payload['size'] = this.state.comments.size

            // Add selected tags to payload
            // Tags is an array of IDs [10,11,12]
            payload['tags'] = Object.keys(this.state.tags.tags)
                .map(x => this.state.tags.tags[x].selected ? parseInt(x) : null)
                .filter(x => x!==null)

            // Add model state to payload
            payload['state'] = {
                "inputs": this.state.landscapes[this.state.landscape_id],
                "outputs": this.state.data.raw[this.state.landscape_id],
                "totalArea": this.state.totalArea
            }

            // Now reload the first comments page to display user's comment
            let newComments = await http.postComment(payload)
            this.commit("setComments", newComments)
        }
        catch (err) {
            this.commit("raiseError", err)
            return err
        }

        this.commit("resetAllTagSelected")
        this.commit("activateTags", this.state.historyIndex)
    },

    /***
     * Load a comment reply
     * @param _ unused state
     * @param reply_id
     * @returns {Promise<void>}
     */
    async loadReply(_, reply_id) {
        try {
            return await http.loadReply(reply_id)
        }
        catch (err) {
            this.commit("raiseError", err)
        }
    },

    /***
     * Reset application state
     * @returns {Promise<void>}
     */
    async resetState() {
        this.commit("clearMessages")
        this.commit("resetToBAU")
        await this.dispatch("sumArea")
        this.commit("pushHistory", [1]) // Include 'business-as-usual' tag
    },

    /***
     * Get SID and commit new Session mutation in store
     * @returns {Promise<void>}
     */
    async newSession() {
        try {
            this.commit('clearHistory')
            this.commit('pushSession')
            this.dispatch('resetState')
        }
        catch (err) {
            this.commit("raiseError", err)
        }
    },

    /**
     * Load a session into history for viewing (read-only)
     * @param _
     * @param index
     */
    viewSession(_, index) {
        console.info(`Loading session at ${index} with id ${this.state.sessions[index].id}`)
    },

    /**
     * Load a session into history to edit (copy)
     * @param _
     * @param index
     */
    forkSession(_, index) {
        const sid = this.state.sessions[index].id
        console.info(`Forking session at ${index} with id ${sid}`)
        this.commit('deepCopyHistoryFromSession', index)
        this.commit('pushSession', this.state.history.length, sid)
        this.commit('loadFromHistory', 0)
    }
}