const getDefaultState = () => {
  return {
    snackbar: {
      visible: false,
      text: "",
      timeout: 5000,
      color: "info"
    },
    loading: false
  };
};
const state = getDefaultState();

const getters = {
  snackbar(state) {
    return state.snackbar;
  },
  loading(state) {
    return state.loading;
  }
};

const actions = {
  setSnackbar({ commit }, Snackbar) {
    commit("setSnackbar", Snackbar);
  },
  setLoading({ commit }, loading) {
    commit("setLoading", loading);
  }
};

const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  },
  setSnackbar(state, payload) {
    state.snackbar = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
