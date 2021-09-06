import Vue from "vue";
import Vuex from "vuex";

import app from "./modules/appState";
import videoCropper from "./modules/videoCropper";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    videoCropper,
    app
  }
});
