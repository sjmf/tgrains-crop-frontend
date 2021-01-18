// actions.js

import { cacheAction } from "vuex-cache";
import http from "@/services/http";
import {cloneDeep} from "lodash";

export default {
    /***
     * Load the Business-as-usual state from the server.
     * Called on App.vue mounting (page load) and by LandAreaMenu when area changes.
     * Actions: newSession
     *
     * @returns {Promise<void>}
     */
    async loadBauState() {
        try {
            let bau = this.state.bau[this.state.landscape_id]

            // If BAU object is empty, go get it
            if (Object.keys(bau).length === 0 && bau.constructor === Object) {

                console.warn("Loading Strings and BAU state from server")

                const strings = await http.loadStrings(this.state.landscape_id)
                this.commit("setStrings", strings)

                bau = await http.loadBAUState(this.state.landscape_id)
                this.commit("setBAUState", bau)

                // Populate Landscapes in Vuex using strings and cropAreas from BAU state
                this.commit("populate")
            }

            // Create new session and push initial state onto history stack (including BAU tag [1])
            await this.dispatch('newSession')
            this.dispatch('resetState')

        } catch (err) {
            console.error(err)
            this.commit("raiseError", err)
        }
    },

    /***
     * Grab the payload, dispatch the query, store the result.
     * Actions: getPayload, doModelQuery, pushStateAndPOST
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
                    this.dispatch("pushStateAndPOST")
                    // Activate tags for this query (must run after history push as uses state)
                    this.commit("activateTags", this.state.historyIndex)
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

            // Used to add model state to payload. Now we just reference the stored one
            // payload['state'] = {
            //     "inputs": this.state.landscapes[this.state.landscape_id],
            //     "outputs": this.state.data.raw[this.state.landscape_id],
            //     "totalArea": this.state.totalArea
            // }
            payload['session_id'] = this.state.sessions[this.state.sessions.length -1].id
            payload['index'] = this.state.historyIndex

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

    /**
     * Load a state from a comment into the current session/state
     * Actions: pushStateAndPOST
     * @param _ unused state
     * @param comment
     */
    loadStateFromComment(_, comment) {
        // Save existing state in local variable
        let history = cloneDeep(this.state.history[this.state.historyIndex])

        // Overwrite state
        this.commit("updateLandscape", comment.state.inputs)
        this.commit("setDataFromQuery", comment.state.raw) // PASS RAW!
        this.commit("setTotalArea", comment.state.totalArea)

        // Push this new state onto history stack (and server)
        this.dispatch("pushStateAndPOST", [...comment.tags, 2])

        // Tell the user what we've done!
        this.commit('setMessage', {
            message: "Loaded model state from comment by " + comment.author,
            kind: "info",
            callback: () => {
                this.commit("rollbackHistory", history)
            },
            callbackText: "Click here to restore previous state"
        }) // Will also scroll viewport to top
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
     *
     * Called by: SidebarMenu.vue ('Reset' clicked), TabHistory.vue (New session), and actions.js
     *   method loadBAUState (called on App.vue mount app load, and LandAreaMenu.vue when area changed)
     *
     * Actions: sumArea, pushStateAndPOST
     *
     * @returns {Promise<void>}
     */
    async resetState() {
        this.commit("clearMessages")
        this.commit("resetToBAU")

        await this.dispatch("sumArea")
        this.dispatch("pushStateAndPOST", [1]) // Include 'business-as-usual' tag
        this.commit("activateTags", this.state.historyIndex)
    },

    /***
     * Get SID and commit new Session mutation in store
     * Actions: resetState
     * @returns {Promise<void>}
     */
    async newSession() {
        try {
            this.commit('clearHistory')
            this.commit('pushSession')
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
        console.info(`Viewing session at ${index} with id ${this.state.sessions[index].id} `+
            `and a history of ${this.state.sessions[index].history.length} states ` +
            `(recorded ${this.state.sessions[index].count})`)
        this.commit('deepCopyHistoryFromSession', index)
        this.commit('setGlobalReadOnly', true)
        this.commit('loadFromHistory', this.state.history.length -1)
    },

    /**
     * Cancel viewing a session and return to the usual view
     */
    cancelViewSession() {
        this.commit('shallowCopyHistoryFromSession', this.state.sessions.length -1)
        this.commit('setGlobalReadOnly', false)
        this.commit('loadFromHistory', this.state.history.length -1)
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
        this.commit('setGlobalReadOnly', false)
        this.commit('loadFromHistory', this.state.history.length -1)
    },

    /**
     * Push history and POST it to server
     * @param _
     * @param tags
     */
    async pushStateAndPOST(_, tags = []) {

        // Do we have a session ID yet?
        if(this.state.sessions.length === 0) {
            console.error('Set up sessions before pushing history!')
            return
        }

        // Don't enter this `if` on first load (where no history exists before first BAU)
        if(this.state.history.length > 0) {
            // Don't push a BAU state onto the top of the stack when there's already a BAU state there!
            //  (check the tags to see if it's a BAU state- i.e. tags[0] === 1 for both states)
            if (this.state.history[this.state.history.length -1].tags[0] === 1 && tags[0] === 1) {
                console.info("History not pushed as there's already a BAU state at the top!")
                // If there -is- then we should return the index to the top of the stack
                this.commit('resetHistoryIndex')
                return
            }
        }

        // Okay, push history to the local queue (this also sets the tags if they're un-set)
        this.commit("pushHistory", tags)

        // Now, post it to the server (asynchronously, so we don't have to wait)
        http.postState({
            'session_id': this.state.sessions[this.state.sessions.length -1].id,
            'index': this.state.history.length -1,
            'user_id': this.state.user.id,
            'state': this.state.history[this.state.history.length -1],
        }).catch((err)=>{
            this.commit("raiseError", err)
        })
    },

    /**
     * Delete history state and POST changes to server
     *
     * @returns {Promise<void>}
     */
    async deleteState(_, index) {
        this.commit('deleteFromHistory', index)

        http.postState({
            'session_id': this.state.sessions[this.state.sessions.length -1].id,
            'index': this.state.history.length -1,
            'user_id': this.state.user.id,
            'deleted': true,
        }).catch((err)=>{
            this.commit("raiseError", err)
        })
    }
}