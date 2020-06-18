import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    landscape_id: 101,
    landscapeName: 'East Anglia',
    data: {
      // GHG, Nitrogen leeching, Profit, Calories
      production:           [30, 10, -10, -4],
      // Nitrogen leeching, ground water, fish, birds, bees, beneficial arthropods
      pesticideImpacts:     [35, 21, -3, -5, 10, 17],
      // Whole Grains, Tubers, Vegetables, Fruits, Dairy, Added Fats, Saturated Fats, Sugars, Animal Protein, Vegetable Protein
      nutritionaldelivery:  [12, 8, 33, 12, 10, 10, 5, 5, 3, 2],
      // Stroke, Cancer, Heart Disease, Diabetes
      healthRiskFactors:    [20, -26, 17, 40]
    },
    landscapes: {
      // TODO: Implement loading of appropriate BAU state on area change
      //       (or just load the BAU state from the server?)
      101: {
        crops: {
          wheat:       { name:"wheat",       label: "Wheat",          value: 800, description: ""},
          barley:      { name:"barley",      label: "Barley",         value: 230, description: ""},
          oats:        { name:"oats",        label: "Oats",           value: 609, description: ""},
          osr:         { name:"osr",         label: "Oilseed Rape",   value: 170, description: ""},
          veg:         { name:"veg",         label: "Vegetables",     value: 853, description: ""},
          maize:       { name:"maize",       label: "Maize",          value: 679, description: ""},
          peas:        { name:"peas",        label: "Peas & Beans",   value: 563, description: ""},
          potatoes:    { name:"potatoes",    label: "Potatoes",       value: 903, description: ""},
          softfruit:   { name:"softfruit",   label: "Soft fruit",     value: 223, description: ""},
          topfruit:    { name:"topfruit",    label: "Top fruit",      value: 396, description: ""},
          sugarbeet:   { name:"sugarbeet",   label: "Sugar beet",     value: 514, description: ""},
        },
        livestock: {
          dairy:       { name:"dairy",       label: "Dairy Cattle",   value: 541, description: ""},
          beef:        { name:"beef",        label: "Beef Cattle",    value: 775, description: ""},
          chicken:     { name:"chicken",     label: "Chicken",        value: 746, description: ""},
          pork:        { name:"pork",        label: "Pork",           value: 824, description: ""},
          eggs:        { name:"eggs",        label: "Egg Production", value: 481, description: ""},
          lamblowland: { name:"lamblowland", label: "Lowland Lamb",   value: 638, description: ""},
          lambupland:  { name:"lambupland",  label: "Upland Lamb",    value: 0  , description: "", disabled: ""},
        }
      },
      102: {
        //TODO: Define BAU state for South Wales
        crops: { },
        livestock: { }
      }
    },
    // TODO: Remove these temporary BAU values when model updated
    crops: {
      wheat:       { name:"wheat",       label: "Wheat",          value: 800, description: ""},
      barley:      { name:"barley",      label: "Barley",         value: 230, description: ""},
      oats:        { name:"oats",        label: "Oats",           value: 609, description: ""},
      oilseed:     { name:"oilseed",     label: "Oilseed Rape",   value: 170, description: ""},
      vegetables:  { name:"vegetables",  label: "Vegetables",     value: 853, description: ""},
      livestock:   { name:"livestock",   label: "Livestock Grazing", value: 853, description: ""},
      maize:       { name:"maize",       label: "Maize",          value: 679, description: ""},
      beans:       { name:"beans",       label: "Beans",          value: 563, description: ""},
      potatoes:    { name:"potatoes",    label: "Potatoes",       value: 903, description: ""},
      onion:       { name:"onion",       label: "Onion",          value: 514, description: ""},
    },
    livestock: {
      cow:         { name:"cow",        label: "Beef Cattle",    value: 775, description: ""},
      chickens:    { name:"chicken",     label: "Chicken",        value: 746, description: ""},
      sheep:       { name:"sheep",       label: "Lowland Lamb",   value: 638, description: ""},
    }
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
      state[cropOrLivestock][name].value = value;
    },
    setDataFromQuery (state, new_data) {

      // TODO: Compute percentage change against the BAU state
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

      state.data = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
