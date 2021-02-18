const state = {
  filterBy: "Tous"
};

const getters = {
  getFilterBy: state => state.filterBy
};

const mutations = {
  setFilterBy: (state, payload) => (state.filterBy = payload)
};

const actions = {
  setFilterBy: ({ commit }, payload) => commit("setFilterBy", payload)
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
};
