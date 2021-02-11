// actions.js

import { cacheAction } from "vuex-cache";
import http from "@/services/http";

export default {
    /***
     * Load the Business-as-usual state from the server.
     * Called on App.vue mounting (page load) and by LandAreaMenu when area changes.
     * Actions: newSession
     *
     * @returns {Promise<void>}
     */
    async loadBauState(_, areaChanged) {
        // If there's already a session active for this landscape, just load it.
        if (this.state.sessions[this.state.landscape_id].length > 0)
            return this.dispatch("loadTopSession")

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
            if(areaChanged || this.state.sessions[this.state.landscape_id].length === 0)
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
        if (this.state.loading) return

        // Timeout prevents flash of loader in case of fast response
        let timer = setTimeout(()=>{ this.commit("loading", true) }, 200)

        // Close error message in preparation
        this.commit("clearMessages")

        // Prepare payload...
        let payload = await this.dispatch("getPayload")

        // Query Model:
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
        } finally {
            clearTimeout(timer);
            this.commit("loading", false)
        }
    },

    /**
     * Calculate the total area used by crops within the current state
     */
    async sumArea() {
        // Handle not-yet-loaded data edge-case
        if(Object.keys(this.state.landscapes[this.state.landscape_id]).length === 0) {
            this.commit("setAreaUsed", 0, 0)
        }

        this.commit("setAreaUsed", {
            'lowlandArea': await this.dispatch('getLowlandArea'),
            'uplandArea': await this.dispatch('getUplandArea')
        })
    },

    /**
     * Get lowland area
     * @returns {number}
     */
    getLowlandArea() {
        let cropAreas = Object.values(this.state.landscapes[this.state.landscape_id].crops)
        let livestockAreas = Object.values(this.state.landscapes[this.state.landscape_id].livestock)
        let lowlandArea = 0

        for(let area of cropAreas) {
            lowlandArea += area.value
        }

        //add lowland grazing areas
        for(let area of livestockAreas) {
            switch(area.name) {
                case 'all_beef':
                    lowlandArea += area.value * (1 - this.state.data.raw[this.state.landscape_id].grazingProps.beef);
                    break;
                case 'all_lamb':
                    lowlandArea += area.value * (1 - this.state.data.raw[this.state.landscape_id].grazingProps.lamb);
                    break;
                default:
                    lowlandArea += area.value
            }
        }
        return lowlandArea;
    },

    /**
     * Get upland area
     * @returns {number}
     */
    getUplandArea() {
        let livestockAreas = Object.values(this.state.landscapes[this.state.landscape_id].livestock)
        let uplandArea = 0;

        //add upland grazing areas
        for(let area of livestockAreas) {
            switch(area.name) {
                case 'all_beef':
                    uplandArea += area.value * this.state.data.raw[this.state.landscape_id].grazingProps.beef;
                    break;
                case 'all_lamb':
                    uplandArea += area.value * this.state.data.raw[this.state.landscape_id].grazingProps.lamb;
                    break;
            }
        }

        return uplandArea;
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
    doModelQuery (_, payload) {
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
            window.location.reload(false)
        }
    },

    /***
     * Retrieve comments from the server and load them into vuex
     * @param _
     * @param ...kwargs
     */
    async loadComments(_, {...kwargs} = {}) {

        try {
            let comments = await http.loadComments(
                this.state.comments.page,
                this.state.comments.size,
                kwargs
            )

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

            let last = this.state.sessions[this.state.landscape_id].length - 1
            payload['session_id']   = this.state.sessions[this.state.landscape_id][last].id
            payload['index']        = this.state.historyIndex
            payload['landscape_id'] = this.state.landscape_id
            payload['distance']     = this.state.history[this.state.historyIndex].changes.distance

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
     * View a session from a comment
     * @param _
     * @param session
     * @param index
     * @param author
     */
    async viewSessionFromComment(_, {session, index, author}) {
        try {
            console.log(`Loading session from comment by ${author} with id ${session.id} at index ${index}.`)

            await this.commit('deepCopyHistoryFromSession', session)
            await this.commit('loadFromHistory', {
                'history': session.history,
                'index': index
            })
            await this.dispatch("sumArea")
            this.commit("activateTags", this.state.historyIndex)

            this.commit('setGlobalReadOnly', true)

            const format_datetime = (unix_timestamp) => {
                let d = new Date(unix_timestamp * 1000)
                return d.toLocaleDateString("en-GB") + " " + d.toLocaleTimeString("en-GB")
            }

            this.commit('setMessage', {
                title: `Viewing session from comment by ${author}`,
                message: `The current view shows a historic session created at ${format_datetime(session.opened)}.`,
                kind: 'info',
                callback: () => {
                    this.dispatch('cancelViewSession')
                },
                callbackText: 'Click here to close this banner and return',
                dismissible: false
            })
        }
        catch (err) {
            console.error(err)
            this.commit("raiseError", err)
        }
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

    /**
     * Load the session at the top of the stack
     *
     * @returns {Promise<void>}
     */
    async loadTopSession() {
        try {
            console.log(`Loading top session+state from stack "this.state.sessions[${this.state.landscape_id}] `+
                        `with length ${this.state.sessions[this.state.landscape_id].length}`)

            const session = this.state.sessions[this.state.landscape_id]
            await this.commit('shallowCopyHistoryFromSession', session[session.length -1])
            await this.commit('loadFromHistory', {
                'history': this.state.history,
                'index': this.state.history.length - 1
            })
            await this.commit('resetSessionIndex')

            // Sum area and activate tags
            await this.dispatch("sumArea")
            this.commit("activateTags", this.state.historyIndex)
        }
        catch (err) {
            console.error(err)
            this.commit("raiseError", err)
        }
    },

    /***
     * Get SID and commit new Session mutation in store
     * Actions: resetState
     * @returns {Promise<void>}
     */
    async newSession() {
        try {
            await this.commit('clearHistory')
            await this.commit('pushSession', {})
            await this.commit('resetSessionIndex')
        }
        catch (err) {
            console.error(err)
            this.commit("raiseError", err)
        }
    },

    /**
     * Load a session into history for viewing (read-only)
     * @param _
     * @param index
     * @param time
     */
    async viewSession(_, {index, time}) {
        try {
            console.info(`Viewing session at ${index} with id ${this.state.sessions[this.state.landscape_id][index].id} `+
                `and a history of ${this.state.sessions[this.state.landscape_id][index].history.length} states ` +
                `(recorded ${this.state.sessions[this.state.landscape_id][index].count})`)

            await this.commit('deepCopyHistoryFromSession', this.state.sessions[this.state.landscape_id][index])
            await this.commit('loadFromHistory', {
                'history': this.state.history,
                'index': this.state.history.length - 1
            })
            await this.commit('setSessionIndex', index)
            this.commit('setGlobalReadOnly', true)

            this.commit('setMessage', {
                title: 'Viewing historic session',
                message: `The current view shows a historic session created at ${time}.`,
                kind: 'info',
                callback: () => {
                    this.dispatch('cancelViewSession')
                },
                callbackText: 'Click here to close this banner and return',
                dismissible: false
            })
        }
        catch (err) {
            console.error(err)
            this.commit("raiseError", err)
        }
    },

    /**
     * Cancel viewing a session and return to the usual view
     */
    async cancelViewSession() {
        const session = this.state.sessions[this.state.landscape_id]
        await this.commit('shallowCopyHistoryFromSession', session[session.length -1])
        await this.commit('loadFromHistory', {
            'history': this.state.history,
            'index': this.state.history.length - 1
        })
        await this.commit('resetSessionIndex')
        this.commit('setGlobalReadOnly', false)
    },

    /**
     * Load a session into history to edit (copy)
     * @param _
     * @param index
     */
    async forkSession(_, index) {
        const forkSID = this.state.sessions[this.state.landscape_id][index].id
        const count = this.state.history.length

        console.info(`Forking session at ${index} with id ${forkSID}`)
        await this.commit('deepCopyHistoryFromSession', this.state.sessions[this.state.landscape_id][index])
        await this.commit('pushSession', {count, forkSID})
        await this.commit('resetSessionIndex')
        await this.commit('loadFromHistory', {
            'history': this.state.history,
            'index': this.state.history.length - 1
        })
        this.commit('setGlobalReadOnly', false)
    },

    /**
     * Push history and POST it to server
     * @param _
     * @param tags
     */
    async pushStateAndPOST(_, tags = []) {

        // Do we have a session ID yet?
        if(this.state.sessions[this.state.landscape_id].length === 0) {
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
        await this.commit("pushHistory", tags)

        // Now, post it to the server (asynchronously, so we don't have to wait)
        http.postState({
            'session_id': this.state.sessions[this.state.landscape_id][this.state.sessions[this.state.landscape_id].length -1].id,
            'index': this.state.history.length -1,
            'user_id': this.state.user.id,
            'state': this.state.history[this.state.history.length -1],
        }).catch((err)=>{
            this.commit("raiseError", err)
        })
    },

    /**
     * Delete/undelete history state and POST changes to server
     *
     * @param _
     * @param index
     * @param deleted
     * @returns {Promise<void>}
     */
    async setStateDeleted(_, {index, deleted}) {
        this.commit('setHistoryDeleted', {index, deleted})

        http.postState({
            'session_id': this.state.sessions[this.state.landscape_id][this.state.sessions[this.state.landscape_id].length -1].id,
            'user_id': this.state.user.id,
            'index': index,
            'deleted': deleted,
        }).catch((err)=>{
            this.commit("raiseError", err)
        })
    },

}