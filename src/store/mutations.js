// mutations.js

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
                'label': state.dictionary[c],
                'value': cropAreas[i],
                'description': (c in state.descriptions ? state.descriptions[c] : "")
            }
        }

        // Do the same for livestock
        for(let i=0; i < livestock.length; i++) {
            let l = livestock[i]
            landscape['livestock'][l] = {
                'name':  l,
                'label': state.dictionary[l],
                'value': livestockAreas[i],
                'description': (l in state.descriptions ? state.descriptions[l] : "")
            }
        }

        // Store the created landscape variable in the state at the correct position
        console.info("Landscape populated for ID", state.landscape_id)
        state.landscapes[state.landscape_id] = landscape
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
        const crops = state.strings[state.landscape_id].crops
        const livestock = state.strings[state.landscape_id].livestock
        const cropAreas = state.bau[state.landscape_id]["cropAreas"]
        const livestockAreas = state.bau[state.landscape_id]["livestockAreas"]

        for (let i=0; i < crops.length; i++)
            state.landscapes[state.landscape_id]['crops'][crops[i]]['value'] = cropAreas[i]
        for (let i=0; i < livestock.length; i++)
            state.landscapes[state.landscape_id]['livestock'][livestock[i]]['value'] = livestockAreas[i]

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
     * Populate the error message field and set the visibility to true. This is used
     * by the ErrorMessage component to display an error to the user.
     * @param state
     * @param message
     */
    raiseError(state, message) {
        state.error['message'] = message
        state.error['visible'] = true
    },

    /**
     * Set the error message's state to not visible.
     * Does not clear the error message.
     * @param state
     */
    closeError(state){
        state.error['message'] = ""
        state.error['visible'] = false
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