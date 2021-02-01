// mutations.js
import Vue from 'vue'

import {difference, distanceFromBAU, formatData, createUniqueID} from "@/store/helpers";
import {initial_state} from "@/store/state";

const cloneDeep = require('lodash/cloneDeep');

export default {
    /**
     * Update the store with the new landscape ID, which controls area selection
     * 101 = East Anglia, 102 = South Wales
     * @param state
     * @param id
     */
    setLandscapeId (state, id) {
        if(id === 101 || id === 102) {
            state.landscape_id = id
        }
    },

    /**
     * Update the store with the landscape name. Triggered from the LandscapeAreaMenu
     * and takes the value displayed in the selection box.
     * @param state
     * @param name
     */
    setLandscapeName (state, name) {
        state.landscapeName = name;
    },

    /***
     * Mutate the area values used to set cropping area display
     * @param state
     * @param lowlandArea
     * @param uplandArea
     */
    setAreaUsed (state, {lowlandArea, uplandArea}) {
        state.area.lowland = lowlandArea
        state.area.upland = uplandArea
        state.area.total = lowlandArea + uplandArea
    },

    /***
     * Set a crop or livestock area value in the store for the selected landscape.
     * Triggered from SidebarMenu when a value is changed.
     * @param state
     * @param type ('crops' or 'livestock')
     * @param name
     * @param value
     */
    setFormValue (state, {type, name, value}) {
        // Sense-check type ('crops' or 'livestock') and name (must be in landscape at [id])
        if(type in state.landscapes[state.landscape_id] && name in state.landscapes[state.landscape_id][type])
            state.landscapes[state.landscape_id][type][name].value = value;
    },

    /***
     * Store the data returned by the crop model in response to an http AJAX query.
     * The new data is formatted to match the structure in data:{} above, and (where
     * applicable) the percentage difference is taken of the values provided.
     * @param state
     * @param new_data
     */
    setDataFromQuery (state, new_data) {
        // Store the raw data
        state.data.raw[state.landscape_id] = new_data

        // Compute percentage change against the BAU state and store
        state.data[state.landscape_id] = difference(
            formatData(state, state.bau[state.landscape_id]),
            formatData(state, new_data))
    },

    /***
     * Set the Business-as-usual (BAU) state in the store. The BAU state is kept
     * in the same format/structure that it was returned in from the model.
     * Also sets the graph data to 0, with the exception of nutritionalDelivery,
     * as it is the only data which is not percentage-differenced.
     * @param state
     * @param new_data
     */
    setBAUState (state, new_data) {
        // Store the raw data
        state.data.raw[state.landscape_id] = new_data
        state.bau[state.landscape_id] = new_data

        // Initialise graphs
        state.data[state.landscape_id].nutritionaldelivery = new_data['nutritionaldelivery']
        for (let i of ['production', 'pesticideImpacts']) {
            state.data[state.landscape_id][i] = Array.from(new_data[i], () => 0)
        }
    },

    /***
     * Store the strings for the crop and livestock definitions that were returned
     * in response to a http AJAX query to the /strings route. These correspond to
     * the values returned by getCropString() and getLivestockString() in the C++.
     * @param state
     * @param strings
     */
    setStrings (state, strings) {
        state.strings[state.landscape_id] = strings
    },

    /***
     * Populate the landscape data which is used to create menu entries in the
     * SidebarMenu. This does not take any input, so strings and BAU states for
     * the selected landscape_id MUST be loaded prior to calling this method.
     * @param state
     */
    populate (state) {
        // Check we have strings and BAU state, or raise error.
        if(!('crops' in state.strings[state.landscape_id]))
            throw "Cannot populate model variables: strings not loaded."
        if(!('production' in state.bau[state.landscape_id]))
            throw "Cannot populate model variables: BAU state missing"

        // Extract variables into more readable names
        let landscape = {'crops': {}, 'livestock': {}}
        const crops = state.strings[state.landscape_id].crops
        const livestock = state.strings[state.landscape_id].livestock
        const cropAreas = state.bau[state.landscape_id]["cropAreas"]
        const livestockAreas = state.bau[state.landscape_id]["livestockAreas"]

        // Iterate over crop names and populate the landscape with the relevant data
        for(let i=0; i < crops.length; i++) {
            let c = crops[i]
            landscape['crops'][c] = {
                'name':  c,
                'index': i,
                'label': state.dictionary[c],
                'value': Math.floor(cropAreas[i]),
                'bau': Math.floor(cropAreas[i]),
                'description': (c in state.descriptions ? state.descriptions[c] : "")
            }
        }

        // Do the same for livestock
        for(let i=0; i < livestock.length; i++) {
            let l = livestock[i]
            landscape['livestock'][l] = {
                'name':  l,
                'index': i,
                'label': state.dictionary[l],
                'value': Math.floor(livestockAreas[i]),
                'bau': Math.floor(livestockAreas[i]),
                'description': (l in state.descriptions ? state.descriptions[l] : "")
            }
        }

        // Store the created landscape variable in the state at the correct position
        console.info("Landscape populated for ID", state.landscape_id)
        state.landscapes[state.landscape_id] = landscape
    },

    /**
     * Set landscape directly
     * @param state
     * @param landscape
     */
    updateLandscape(state, landscape) {
        let id = state.landscape_id
        for(let i of ['crops', 'livestock'])
            for(let c in state.landscapes[id][i])
                if(Object.prototype.hasOwnProperty.call(state.landscapes[id][i], c))
                    state.landscapes[id][i][c].value = landscape[i][c].value
    },

    /**
     * Load the values from the stored BAU state, overwriting the existing state.
     * This function MUST ONLY be called after the BAU state has been stored.
     * @param state
     */
    resetToBAU (state) {
        // Reset graphs to '0'
        for (let i of ['production', 'pesticideImpacts']) {
            state.data[state.landscape_id][i] = Array.from(state.bau[state.landscape_id][i], () => 0)
        }
        state.data[state.landscape_id]['nutritionaldelivery'] = state.bau[state.landscape_id].nutritionaldelivery

        // Reset landscape values (sidebar data values)
        const crops = state.landscapes[state.landscape_id].crops
        const livestock = state.landscapes[state.landscape_id].livestock

        for (let c in crops)
            if(Object.hasOwnProperty.call(crops, c))
                crops[c].value = crops[c].bau

        for (let l in livestock)
            if(Object.hasOwnProperty.call(livestock, l))
                livestock[l].value = livestock[l].bau

        state.data.raw[state.landscape_id] = state.bau[state.landscape_id]
    },

    /**
     * Push a new session onto the session stack.
     * Commit clearHistory() first for a clean state, or pass its length in to fork a session
     * @param state
     * @param count
     * @param forkSID - SID for the session this was forked from (Default undefined)
     */
    pushSession(state, {count, forkSID}) {
        // Session has a REFERENCE to history.
        // This must be updated with a cloneDeep when new session started
        state.sessions.push({
            id: createUniqueID(),
            count: count || 0,
            opened: Date.now(),
            history: state.history,
            fork: forkSID
        })

        console.log("Created session " + state.sessions[state.sessions.length -1].id)
    },

    /**
     * Deep Copy a history from a Session into the current history stack
     * @param state
     * @param index
     */
    deepCopyHistoryFromSession(state, index) {
        // Set history to undefined so that state.history no longer points to the same object
        //  as the current session! Undesirable behaviour can result from cloneDeep otherwise...
        state.history = undefined
        state.history = cloneDeep(state.sessions[index].history)
    },

    /**
     * Shallow copy a history from a session into the current history stack
     * (used for setting history pointer back to same object)
     * @param state
     * @param index
     */
    shallowCopyHistoryFromSession(state, index) {
        state.history = state.sessions[index].history
    },

    /**
     * Set the global read-only flag
     * @param state
     * @param ro
     */
    setGlobalReadOnly(state, ro) {
        state.readonly = ro
    },

    /**
     * Save state (e.g. before overwriting with state from comment).
     * You should probably be using the pushStateAndPOST action rather than calling this directly
     * @param state
     * @param tags
     */
    pushHistory(state, tags = []) {
        // Get automatic tags for non-bau states
        let result;
        if(tags !== [1]) {
            result = distanceFromBAU(state)

            for(let c of result.changes)
                tags.push(state.tags.mapping[c.name])
        }
        // Keep unique tags only
        tags = [...new Set(tags)]

        // Push state onto history (a stack in reverse)
        state.history.push({
            "inputs": cloneDeep(state.landscapes[state.landscape_id]),
            "outputs": cloneDeep(state.data[state.landscape_id]),
            "raw": cloneDeep(state.data.raw[state.landscape_id]),
            "area": cloneDeep(state.area),
            "time": Date.now(),
            "tags": tags,
            "changes": result,
            "deleted": false
        })

        // Set indices
        state.historyIndex = state.history.length -1
        state.sessions[state.sessions.length -1].count++
    },

    /**
     * Restore state from saved
     * @param state
     * @param load
     */
    rollbackHistory(state, load) {
        // Overwrite local state
        state.landscapes[state.landscape_id] = cloneDeep(load.inputs)
        state.data[state.landscape_id] = cloneDeep(load.outputs)
        state.data.raw[state.landscape_id] = cloneDeep(load.raw)
        state.area = load.area

        // Add 'restored' tag and overwrite old time
        load.tags = [...new Set(load.tags.concat([3]))]
        load.time = Date.now()

        // Push to history queue and set indices
        state.history.push(load)
        state.historyIndex = state.history.length -1
        state.sessions[state.sessions.length -1].count++
    },

    /**
     * Load state from history
     * @param state
     * @param index
     */
    loadFromHistory(state, index= 0) {
        let load = state.history[index]
        state.landscapes[state.landscape_id] = cloneDeep(load.inputs)
        state.data[state.landscape_id] = cloneDeep(load.outputs)
        state.data.raw[state.landscape_id] = cloneDeep(load.raw)
        state.area = load.area

        state.historyIndex = index
    },

    /**
     * Delete state from history
     * @param state
     * @param index
     */
    deleteFromHistory(state, index) {
        state.history[index].deleted = true
        state.sessions[state.sessions.length -1].count--
    },

    /**
     * Wipe History except for current state
     * @param state
     */
    clearHistory(state) {
        state.history = []
        state.historyIndex = 0
    },

    /**
     * Set the historyIndex pointer to the top of the stack
     * @param state
     */
    resetHistoryIndex(state) {
        state.historyIndex = state.history.length -1
    },

    /**
     * Set comments retrieved from the API on the state
     * @param state
     * @param comments
     */
    setComments(state, comments) {
        state.comments.comments = comments.comments
        state.comments.page     = comments.page
        state.comments.size     = comments.size
        state.comments.length   = comments.length
        // state.comments.filter   = comments.filter // TODO: Uncomment when server echoes these values
        // state.comments.sort     = comments.sort
    },

    /**
     * Set the page to request for comment pagination
     * @param state
     * @param page
     */
    setCommentsPage(state, page) {
        state.comments.page = page
    },

    /**
     * Set number of comments to load in
     * @param state
     * @param size
     */
    setCommentsSize(state, size) {
        state.comments.size = size
    },

    /**
     * Set the comments sorting order
     * 1.	?sort=0     By date (ascending)
     * 2.   ?sort=1     By date (descending)
     * 3.	?sort=2     By distance from BAU (read distance calculations for state and sort)
     * 4.   ?sort=3     By distance from the current state (also pass distance)
     *
     * @param state
     * @param sort
     */
    setCommentsSort(state, sort) {
        state.comments.sort = sort
    },

    /**
     * Set the comments filter option
     * 1.	?filter=0   All Comments (default view – filtering off)
     * 2.	?filter=1   My Comments (filter by UID)
     * 3.	?filter=2   Another User’s comments (filter by UID, @click on user icon/name and emit event from CommentCard.vue)
     * 4.	?filter=3   Replies to a comment (get all replies to a comment ID)
     * 5.	?filter=4   Comments with the same tags (tag-based filtering)
     *
     * @param state
     * @param filter
     */
    setCommentsFilter(state, filter) {
        state.comments.filter = filter
    },

    /**
     * Set tags in state, with tags.tags and tags.groups set
     * separately so as not to overwrite tags.mapping
     * @param state
     * @param tags
     */
    setTags(state, tags) {
        state.tags.tags = tags.tags
        state.tags.groups = tags.groups
    },

    /**
     * Update a tag's status to selected (or not)
     * @param state
     * @param payload
     */
    setTagSelected(state, payload) {
        let [id, value] = Object.values(payload)

        /*
         * Maintain reactivity by using Vue.set as 'tags' is loaded after page via AJAX!
         * https://medium.com/js-dojo/reactivity-in-vue-js-and-its-pitfalls-de07a29c9407
         * Basically, don't do this: `state.tags.tags[id].selected = value`
         *     as the prop `selected` doesn't yet exist and isn't watched by Vue
         */
        Vue.set(state.tags.tags[id], 'selected', value)
    },

    /**
     * Set tags from a history state 'selected'
     * @param state
     * @param index
     */
    activateTags(state, index) {
        // First, deactivate crop/livestock area tags
        for (let id of state.tags.groups[1]) {
            Vue.set(state.tags.tags[id], 'selected', false)  // Reactive prop
        }

        // Load tags from group 1 only (input areas)
        let history = state.history[index]
        for(let id of history.tags) {
            if(state.tags.tags[id].group === 1) {
                Vue.set(state.tags.tags[id], 'selected', true)  // Reactive prop
            }
        }
    },

    /**
     * Reset all tags to non-selected state
     * @param state
     */
    resetAllTagSelected(state) {
        for (let id in state.tags.tags)
            if(Object.hasOwnProperty.call(state.tags.tags, id))
                state.tags.tags[id].selected = false
    },

    /**
     * Save name and email into state when leaving a comment
     * @param state
     * @param payload
     */
    saveNameAndEmail(state, payload) {
        let [name, email] = Object.values(payload)
        state['user']['name'] = name
        state['user']['email'] = email
    },

    /**
     * Push an error message onto the messages array. This is used
     * with the MessageBox component to display an error to the user.
     * @param state
     * @param message
     */
    raiseError(state, message) {
        if(state.messages.length > state.maxMessages)
            state.messages.shift()
        state.messages.push({
            message: message,
            kind: 'error'
        })
        window.scrollTo(0,0);
    },

    /**
     * Set the error message's state to not visible.
     * Does not clear the error message.
     * @param state
     * @param index
     */
    closeMessage(state, index){
        state.messages.splice(index, 1)
    },

    /**
     * Set a message in the state
     * @param state
     * @param payload
     */
    setMessage(state, payload) {
        if(state.messages.length > state.maxMessages)
            state.messages.shift()
        state.messages.push(payload)
        window.scrollTo(0,0);
    },

    /**
     * Clear all messages, including error messages
     * @param state
     */
    clearMessages(state){
        state.messages = []
    },

    /**
     * Indicates that the user has clicked the 'Accept and continue' button on the welcome modal.
     * @param state
     */
    acceptTerms(state) {
        state.acceptedTerms = true
    },

    /**
     * Reload entire state from defaults
     */
    resetVuexDefaults(state) {
        const initial = initial_state()
        Object.keys(initial).forEach(key => { state[key] = initial[key] })
    },

    /**
     * Invalidate store version hash
     */
    invalidateStore(state) {
        state.versionHash = 'invalid';
        localStorage.clear()
    }
}