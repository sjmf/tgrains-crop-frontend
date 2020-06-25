import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})


export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    landscape_id: 101,
    landscapeName: 'East Anglia',
    data: {
      // GHG, Nitrogen leeching, Profit, Calories
      production:           [0,0,0,0],             //[30, 10, -10, -4],
      // Nitrogen leeching, ground water, fish, birds, bees, beneficial arthropods
      pesticideImpacts:     [0,0,0,0,0,0],         //[35, 21, -3, -5, 10, 17],
      // Whole Grains, Tubers, Vegetables, Fruits, Dairy, Added Fats, Saturated Fats, Sugars, Animal Protein, Vegetable Protein
      nutritionaldelivery:  [0,0,0,0,0,0,0,0,0,0], //[12, 8, 33, 12, 10, 10, 5, 5, 3, 2],
      // Stroke, Cancer, Heart Disease, Diabetes
      healthRiskFactors:    [0,0,0,0]              //[20, -26, 17, 40]
    },
    /***
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
    bau: {
      101: { },
      102: { }
    },
    strings: {
      101: { },
      102: { }
    },

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

      // Prototype-specific strings
      oilseed:     "Oilseed Rape",
      vegetables:  "Vegetables",
      beans:       "Peas & Beans",
      onion:       "Onions",
      chickens:    "Chicken",
      sheep:       "Lowland Lamb",
    },

    descriptions: {
      lamblowland: "Lowland Lamb grazing livestock",
      lambupland: "Upland Lamb grazing livestock. Found predominantly in the Brecon Beacons.",
    },

    // Error handling:
    error: {
      message: "",
      visible: false
    },

    // Accepted terms
    acceptedTerms: false
  },
  mutations: {
    setLandscapeId (state, id) {
      if(id === 101 || id === 102) {
        state.landscape_id = id
      }
    },
    setLandscapeName (state, name) {
      state.landscapeName = name;
    },
    setData (state, data) {
      state.data = data;
    },
    setFormValue (state, {cropOrLivestock, name, value}) {
      //console.debug({cropOrLivestock, name, value})
      state.landscapes[state.landscape_id][cropOrLivestock][name].value = value;
    },
    setDataFromQuery (state, new_data) {
      // Compute percentage change against the BAU state and store
      state.data = difference(formatData(state.bau[state.landscape_id]), formatData(new_data))
    },
    setBAUState (state, new_data) {
      state.bau[new_data['myUniqueLandscapeID']] = new_data;
    },
    setStrings (state, strings) {
      state.strings[state.landscape_id] = strings
    },
    populate (state) {
      // Check we have strings and BAU state, or raise error.
      if(!('crops' in state.strings[state.landscape_id]))
        throw Error("Cannot populate model variables: strings not loaded.")
      if(!('production' in state.bau[state.landscape_id]))
        throw Error("Cannot populate model variables: BAU state missing")

      let landscape = {'crops': {}, 'livestock': {}}
      const crops = state.strings[state.landscape_id].crops
      const livestock = state.strings[state.landscape_id].livestock
      const cropAreas = state.bau[state.landscape_id]["cropAreas"]
      const livestockNumbers = state.bau[state.landscape_id]["livestockNumbers"]  // TODO: This is likely to change to livestockAreas!

      for(let i=0; i < crops.length; i++) {
        let c = crops[i]
        landscape['crops'][c] = {
          'name':  c,
          'label': state.dictionary[c],
          'value': cropAreas[i],
          'description': (c in state.descriptions ? state.descriptions[c] : "")
        }
      }

      for(let i=0; i < livestock.length; i++) {
        let l = livestock[i]
        landscape['livestock'][l] = {
          'name':  l,
          'label': state.dictionary[l],
          'value': livestockNumbers[i],  // TODO: This is likely to change to livestockAreas!
          'description': (l in state.descriptions ? state.descriptions[l] : "")
        }
      }

      console.info("Landscape populated for ID", state.landscape_id)
      state.landscapes[state.landscape_id] = landscape
    },
    resetToBAU (state) {
      // Reset graphs
      let fields = ['production', 'pesticideImpacts', 'healthRiskFactors']
      for (let i of fields) {
        state.data[i] = Array.from(state.data[i], () => 0)
      }
      state.data['nutritionaldelivery'] = state.bau[state.landscape_id].nutritionaldelivery

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
    raiseError(state, message) {
      state.error['message'] = message
      state.error['visible'] = true
    },
    closeError(state){
      state.error['visible'] = false
    },
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

/* Helper function */
/* Perform percentage difference on old data and new data */
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

/* Format data returned by model for graphing */
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