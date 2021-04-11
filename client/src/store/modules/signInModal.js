import { getField, updateField } from "vuex-map-fields";

const state = {
  email: null,
  password: null,
  errorMessage: null,
  passwordSuccessfullyReset: true
};

const getters = {
  getErrorMessage: state => state.errorMessage,
  getPasswordSuccessfullyReset: state => state.passwordSuccessfullyReset,
  getField
};

const mutations = {
  resetForm(state) {
    (state.email = null),
      (state.password = null),
      (state.errorMessage = null),
      (state.passwordSuccessfullyReset = null);
  },
  setErrorMessage: (state, payload) => (state.errorMessage = payload),
  setPasswordSuccessfullyResetToTrue: state =>
    (state.passwordSuccessfullyReset = true),
  setPasswordSuccessfullyResetToFalse: state =>
    (state.passwordSuccessfullyReset = false),
  updateField
};

const actions = {
  resetForm: ({ commit }) => commit("resetForm"),
  setErrorMessage: ({ commit }, payload) => commit("setErrorMessage", payload),
  setPasswordSuccessfullyResetToTrue: ({ commit }) =>
    commit("setPasswordSuccessfullyResetToTrue"),
  setPasswordSuccessfullyResetToFalse: ({ commit }) =>
    commit("setPasswordSuccessfullyResetToFalse")
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
};
