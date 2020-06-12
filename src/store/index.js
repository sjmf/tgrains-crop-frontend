import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    landscapeID: 101,
    landscapeName: 'East Anglia'
  },
  mutations: {
    setLandscapeId (state, id) {
      if(id == 101 || id == 102) {
        state.landscapeID = id
      }
    },
    setLandscapeName (state, name) {
      state.landscapeName = name;
    }
  },
  actions: {
  },
  modules: {
  }
})
