import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Persist all data in the browser's local storage
import VuexPersistence from 'vuex-persist'
// eslint-disable-next-line no-unused-vars
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

/***
 * Vuex data store. Global variables for the UI live here.
 */
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    // Landscape definitions
    landscape_id: 101,
    landscapeName: 'East Anglia',

    // Data used by chart.js to render graphs. Loaded via AJAX.
    data: {
      101: {
        // GHG, Nitrogen leeching, Profit, Calories
        production:           [0,0,0,0],
        // Nitrogen leeching, ground water, fish, birds, bees, beneficial arthropods
        pesticideImpacts:     [0,0,0,0,0,0],
        // Whole Grains, Tubers, Vegetables, Fruits, Dairy, Added Fats, Saturated Fats, Sugars, Animal Protein, Vegetable Protein
        nutritionaldelivery:  [0,0,0,0,0,0,0,0,0,0],
        // Stroke, Cancer, Heart Disease, Diabetes
        healthRiskFactors:    [0,0,0,0]
      },
      102: {}
    },

    /*
     * Each landscape [101],[102] contains a crop and livestock data object {crops: {}, livestock: {}}
     * Within these, we store the string identifier (name), a string label (visually presented to the user),
     * the value of the crop, and an optional description.
     *    E.g.: peas: { name:"peas", label: "Peas & Beans", value: 800, description: ""}
     * These are bound to the VariableRow components in the SidebarMenu, and are used when submitting a Model query.
     */
    landscapes: {
      101: { },
      102: { }
    },

    // Business-as-usual state. Loaded via AJAX.
    bau: {
      101: { },
      102: { }
    },

    // Crop and livestock variable name strings. Loaded via AJAX. Used to populate SidebarMenu
    strings: {
      101: { },
      102: { }
    },

    // Dictionary used to look up labels from the variable name returned by the model
    dictionary: {
      wheat:       "Wheat",
      barley:      "Barley",
      oats:        "Oats",
      osr:         "Oilseed Rape",
      veg:         "Vegetables",
      livestock:   "Livestock",
      maize:       "Maize",
      peas:        "Peas & Beans",
      potatoes:    "Potatoes",
      softfruit:   "Soft fruit",
      topfruit:    "Top fruit",
      sugarbeet:   "Sugar beet",
      dairy:       "Dairy Cattle",
      beef:        "Beef Cattle",
      cow:         "Beef Cattle",
      chicken:     "Chicken",
      pork:        "Pork",
      eggs:        "Egg Production",
      lamblowland: "Lowland Lamb",
      lambupland:  "Upland Lamb",

      // TODO: Prototype/dummy model specific strings. Remove for real version.
      oilseed:     "Oilseed Rape",
      vegetables:  "Vegetables",
      beans:       "Peas & Beans",
      onion:       "Onions",
      chickens:    "Chicken",
      sheep:       "Lowland Lamb",
    },

    // Descriptions used to format tooltips. Not all crop/livestock types need one.
    descriptions: {
      lamblowland: "Lowland Lamb grazing livestock",
      lambupland: "Upland Lamb grazing livestock. Found predominantly in the Brecon Beacons.",
    },

    // Error handling:
    error: {
      message: "",
      visible: false
    },

    // User has accepted the usage terms. Persistence means the modal won't be shown again.
    acceptedTerms: false
  },

  mutations: {
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

    /**
     * Write the data which is picked up by the graphs into the store.
     * See the state definition above for format.
     * @param state
     * @param data
     */
    setData (state, data) {
      state.data = data;
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
      // Compute percentage change against the BAU state and store
      state.data[state.landscape_id] = difference(formatData(state.bau[state.landscape_id]), formatData(new_data))
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
      state.bau[new_data['myUniqueLandscapeID']] = new_data
      state.data[state.landscape_id].nutritionaldelivery = new_data['nutritionaldelivery']

      for (let i of ['production', 'pesticideImpacts', 'healthRiskFactors']) {
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
        throw Error("Cannot populate model variables: strings not loaded.")
      if(!('production' in state.bau[state.landscape_id]))
        throw Error("Cannot populate model variables: BAU state missing")

      // Extract variables into more readable names
      let landscape = {'crops': {}, 'livestock': {}}
      const crops = state.strings[state.landscape_id].crops
      const livestock = state.strings[state.landscape_id].livestock
      const cropAreas = state.bau[state.landscape_id]["cropAreas"]
      const livestockNumbers = state.bau[state.landscape_id]["livestockNumbers"]  // TODO: This is likely to change to livestockAreas!

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
          'value': livestockNumbers[i],  // TODO: This is likely to change to livestockAreas!
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
      for (let i of ['production', 'pesticideImpacts', 'healthRiskFactors']) {
        state.data[state.landscape_id][i] = Array.from(state.bau[state.landscape_id][i], () => 0)
      }
      state.data[state.landscape_id]['nutritionaldelivery'] = state.bau[state.landscape_id].nutritionaldelivery

      // Reset landscape values (sidebar data values)
      const crops = state.strings[state.landscape_id].crops
      const livestock = state.strings[state.landscape_id].livestock
      const cropAreas = state.bau[state.landscape_id]["cropAreas"]
      const livestockNumbers = state.bau[state.landscape_id]["livestockNumbers"]

      for (let i=0; i < crops.length; i++)
        state.landscapes[state.landscape_id]['crops'][crops[i]]['value'] = cropAreas[i]
      for (let i=0; i < livestock.length; i++)
        state.landscapes[state.landscape_id]['livestock'][livestock[i]]['value'] = livestockNumbers[i]

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
      state.error['visible'] = false
    },

    /**
     * Indicates that the user has clicked the 'Accept and continue' button on the welcome modal.
     * @param state
     */
    acceptTerms(state) {
      state.acceptedTerms = true
    }
  },

  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]

})

/* Helper functions */

/***
 * Perform percentage difference on old data and new data
 * @param bau
 * @param new_data
 * @returns {{pesticideImpacts: [], healthRiskFactors: [], production: [], nutritionaldelivery: *}}
 */
function difference(bau, new_data) {
  let data = {
    production: [],
    pesticideImpacts: [],
    nutritionaldelivery: new_data['nutritionaldelivery'], // Nutri pie chart not diffed
    healthRiskFactors: []
  }

  let fields = ['production', 'pesticideImpacts', 'healthRiskFactors']
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
 * @param new_data
 * @returns {{pesticideImpacts: [], healthRiskFactors: [], production: [], nutritionaldelivery: []}}
 */
function formatData(new_data){
  let data = {production: [], pesticideImpacts: [], nutritionaldelivery: [], healthRiskFactors: []}

  data['production'] = [
    new_data['greenhouseGasEmissions'],
    new_data['nLeach'],
    new_data['profit'],
    new_data['production']
  ]

  data['pesticideImpacts'] = [new_data['nLeach']].concat(new_data['pesticideImpacts'])
  data['nutritionaldelivery'] = new_data['nutritionaldelivery']
  data['healthRiskFactors'] = new_data['healthRiskFactors']

  return data
}