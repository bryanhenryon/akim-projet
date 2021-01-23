import { getField, updateField } from "vuex-map-fields";

const state = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  usernameErrorMessage: "",
  emailErrorMessage: "",
  passwordErrorMessage: "",
  confirmPasswordErrorMessage: ""
};

const getters = {
  getField
};

const mutations = {
  setUsernameErrorMessage: (state, payload) =>
    (state.usernameErrorMessage = payload),
  setEmailErrorMessage: (state, payload) => (state.emailErrorMessage = payload),
  setPasswordErrorMessage: (state, payload) =>
    (state.passwordErrorMessage = payload),
  setConfirmPasswordErrorMessage: (state, payload) =>
    (state.confirmPasswordErrorMessage = payload),
  resetForm: state => {
    state.username = "";
    state.email = "";
    state.password = "";
    state.confirmPassword = "";
    state.usernameErrorMessage = "";
    state.emailErrorMessage = "";
    state.passwordErrorMessage = "";
    state.confirmPasswordErrorMessage = "";
  },
  updateField
};

export default {
  state,
  getters,
  mutations,
  namespaced: true
};
