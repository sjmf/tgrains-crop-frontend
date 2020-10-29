// mutations.js
const cloneDeep = require('lodash/cloneDeep');
import {initial_state} from "@/store/state";

/* Helper functions */

/***
 * Perform percentage difference on old data and new data
 * @param bau
 * @param new_data
 * @returns {{pesticideImpacts: [], production: [], nutritionaldelivery: *}}
 */
function difference(bau, new_data) {
    let data = {
        production: [],
        pesticideImpacts: [],
        nutritionaldelivery: new_data['nutritionaldelivery'], // Nutri pie chart not diffed
        eatLancetPlate: new_data['eatLancetPlate']            // EAT Lancet plate not diffed
    }

    let fields = ['production', 'pesticideImpacts']
    for (let i of fields) {
        for (let j=0; j < bau[i].length; j++) {
            //console.debug(i, j, new_data[i][j], bau[i][j])
            data[i][j] = ((new_data[i][j] / bau[i][j]) * 100) - 100
        }
    }
    return data
}

/***
 * Format data returned by model, ready for graphing or differencing
 * @param state
 * @param new_data
 * @returns {{pesticideImpacts: [], production: [], nutritionaldelivery: []}}
 */
function formatData(state, new_data){
    let data = {production: [], pesticideImpacts: [], nutritionaldelivery: [], eatLancetPlate: []}

    data['production'] = [
        new_data['greenhouseGasEmissions'],
        new_data['nLeach'],
        new_data['profit'],
        new_data['production']
    ]

    data['pesticideImpacts'] = [new_data['nLeach']].concat(new_data['pesticideImpacts'])
    data['nutritionaldelivery'] = new_data['nutritionaldelivery']
        // .map(x => Math.round(x*10000)/100)   // Round the float-point to 2dp
    data['eatLancetPlate'] = initial_state().data[state.landscape_id].eatLancetPlate // Static. Does not change.

    return data
}

/**
 * Return a score for the distance of the state from BAU, plus an array of the changed values
 * sorted in descending order with the most different value first
 * @param state
 * @returns {{distance: number, changes: []}}
 */
function distanceFromBAU(state) {
    const crops = state.landscapes[state.landscape_id].crops
    const lives = state.landscapes[state.landscape_id].livestock

    let sum = 0
    let changes = []

    const process = function(name,factor) {
        let dist = Math.abs(factor[name].bau - factor[name].value)
        sum += dist
        if(dist > 0) changes.push({name, dist})
    }

    for (let name in crops)
        process(name, crops)
    for (let name in lives)
        process(name, lives)

    // Reverse sort
    changes.sort((a,b) => {
        if(a.dist > b.dist) return -1
        if(b.dist > a.dist) return 1
        return 0
    })

    return {
        distance: sum,
        changes: changes
    }
}

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
     * Mutate the totalArea value used to set cropping area display
     * @param state
     * @param value
     */
    setTotalArea (state, value) {
        state.totalArea = value
    },

    /***
     * Set a crop or livestock area value in the store for the selected landscape.
     * Triggered from SidebarMenu when a value is changed.
     * @param state
     * @param cropOrLivestock
     * @param name
     * @param value
     */
    setFormValue (state, {cropOrLivestock, name, value}) {
        //console.debug({cropOrLivestock, name, value})
        state.landscapes[state.landscape_id][cropOrLivestock][name].value = value;
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
            crops[c].value = crops[c].bau
        for (let l in livestock)
            livestock[l].value = livestock[l].bau

        state.data.raw[state.landscape_id] = state.bau[state.landscape_id]
    },

    /**
     * Save state (e.g. before overwriting with state from comment)
     * @param state
     * @param tags
     */
    pushHistory(state, tags = []) {
        // Don't push a BAU state onto the top of the stack when there's already a BAU state there!
        if(state.history.length > 0) /// Don't hit this on first load (where no history exists before first BAU)
            if(state.history[0].tags[0] === 1 && tags[0] === 1)
                return

        // Get automatic tags for non-bau states
        if(tags !== [1]) {
            let result = distanceFromBAU(state)
            //let distance = result.distance
            for(let c of result.changes)
                tags.push(state.tags.mapping[c.name])
        }

        // Push state onto history (a stack in reverse)
        state.history.unshift({
            "inputs": cloneDeep(state.landscapes[state.landscape_id]),
            "outputs": cloneDeep(state.data[state.landscape_id]),
            "raw": cloneDeep(state.data.raw[state.landscape_id]),
            "totalArea": state.totalArea,
            "time": Date.now(),
            "tags": tags
        })

        // Set index
        state.historyIndex = 0
    },

    /**
     * Restore state from saved
     * @param state
     */
    rollbackHistory(state) {
        let load = state.history.shift()
        state.landscapes[state.landscape_id] = cloneDeep(load.inputs)
        state.data[state.landscape_id] = cloneDeep(load.outputs)
        state.data.raw[state.landscape_id] = cloneDeep(load.raw)
        state.totalArea = load.totalArea
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
        state.totalArea = load.totalArea

        state.historyIndex = index
    },

    /**
     * Delete state from history
     * @param state
     * @param index
     */
    deleteFromHistory(state, index) {
        state.history.splice(index, 1)
        if(index < state.historyIndex)
            state.historyIndex--
    },

    /**
     * Wipe History except for current state
     * @param state
     */
    clearHistory(state) {
        state.history = [state.history[state.historyIndex]]
        state.historyIndex = 0
    },

    /**
     * Set comments retrieved from the API on the state
     * @param state
     * @param comments
     */
    setComments(state, comments) {
        state['comments'] = comments
    },

    /**
     * Set the page to request for comment pagination
     * @param state
     * @param page
     */
    setCommentsPage(state, page) {
        state['comments'].page = page
    },

    /**
     * Set tags in state
     * @param state
     * @param tags
     */
    setTags(state, tags) {
        // copy these separately, so as not to overwrite tags.mapping
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

        state.tags.tags[id].selected = value
    },

    /**
     * Reset all tags to non-selected state
     * @param state
     */
    resetAllTagSelected(state) {
        for (let id in state.tags.tags) {
            state.tags.tags[id].selected = false;
        }
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
    }
}