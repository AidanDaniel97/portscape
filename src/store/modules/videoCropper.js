const state = {
  cropper: null,
  videoFile: null
};

const getters = {
  cropper(state) {
    return state.cropper;
  },
  videoFile(state) {
    return state.videoFile;
  }
};

const actions = {
  setCropper({ commit }, cropper) {
    commit("setCropper", cropper);
  },
  setVideoFile({ commit }, file) {
    commit("setVideoFile", file);
  }
};

const mutations = {
  setCropper(state, cropper) {
    state.cropper = cropper;
  },
  setVideoFile(state, file) {
    state.videoFile = file;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
