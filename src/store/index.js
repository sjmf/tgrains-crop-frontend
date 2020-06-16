import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    landscapeID: 101,
    landscapeName: 'East Anglia',
    data: {},

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
  mutations: {
    setLandscapeId (state, id) {
      if(id == 101 || id == 102) {
        state.landscapeID = id
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
    }
  },
  actions: {
  },
  modules: {
  }
})
