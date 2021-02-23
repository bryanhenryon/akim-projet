const state = {
  playingSong: null
};

const getters = {
  getPlayingSong: state => state.playingSong
};

const mutations = {
  playingSong: (state, playingSong) => (state.playingSong = playingSong)
};

const actions = {
  playingSong: ({ commit }, playingSong) => commit("playingSong", playingSong)
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
};
