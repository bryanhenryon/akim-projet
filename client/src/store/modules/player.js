const state = {
  playingSong: null,
  songVolume: 0.5
};

const getters = {
  getPlayingSong: state => state.playingSong,
  getSongVolume: state => state.songVolume
};

const mutations = {
  playingSong: (state, playingSong) => (state.playingSong = playingSong),
  setSongVolume: (state, volume) => (state.songVolume = volume)
};

const actions = {
  playingSong: ({ commit }, playingSong) => commit("playingSong", playingSong),
  setSongVolume: ({ commit }, volume) => commit("setSongVolume", volume)
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
};
