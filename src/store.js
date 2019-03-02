import Vue from "vue";
import Vuex from "vuex";
import api from "./services/api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    user: {},
    settings: null,
    loading: {},
    entries: {
      data: [],
      failed: {}
    },
    deleting: null,
    error: null
  },
  mutations: {
    SET_USER_DATA(state, data) {
      state.token = data.token;
      state.user = data;
    },
    FETCHING_SETTINGS(state) {
      Vue.set(state.loading, "settings", true);
    },
    FETCHING_SETTINGS_SUCCESS(state, settings) {
      Vue.delete(state.loading, "settings");
      Vue.set(state, "settings", settings);
    },
    FETCHING_ENTRIES(state) {
      Vue.set(state.loading, "entries", true);
    },
    FETCHED_ENTRIES(state, entries) {
      Vue.delete(state.loading, "entries");
      Vue.set(state.entries, "data", entries.data);
    },
    SEND_ARTICLE(state) {
      Vue.delete(state.entries.failed, "send");
      Vue.set(state.loading, "new-article", true);
    },
    SEND_ARTICLE_SUCCESS(state) {
      Vue.delete(state.loading, "new-article");
    },
    SEND_ARTICLE_FAILED(state, msg) {
      Vue.delete(state.loading, "new-article");
      Vue.set(state.entries.failed, "send", msg);
    },
    DELETE_ARTICLE(state, id) {
      state.deleting = id;
    },
    DELETE_ARTICLE_SUCCESS(state) {
      state.deleting = null;
    },
    DELETE_ARTICLE_FAILED(state, err) {
      state.error = err;
    }
  },
  actions: {
    // the login is for creating a token
    async login({ commit }, auth) {
      const resp = await api.post("login", auth);
      Object.assign(api.defaults, {
        headers: { "x-auth-token": resp.data.token }
      });
      localStorage.setItem("token", resp.data.token);
    },
    // the verify token function is for retrieving the user data that fits the token
    async verifyToken({ state, commit }) {
      // check if the token is not yet stored in the store and check the localStorage
      if (!state.token.length && localStorage.getItem("token")) {
        Object.assign(api.defaults, {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
      }
      const tokenData = await api.get("verify?_=" + new Date().getTime()); // prevent cache
      commit("SET_USER_DATA", tokenData.data);
    },
    async logoutUser() {
      localStorage.removeItem("token");
    },
    async getEntries({ commit }) {
      commit("FETCHING_ENTRIES");
      const entries = await api.get("entries");
      commit("FETCHED_ENTRIES", entries);
    },
    async sendEntry({ commit, dispatch }, data) {
      commit("SEND_ARTICLE");
      try {
        await api.post("entries", data);
        await dispatch("getEntries");
        commit("SEND_ARTICLE_SUCCESS");
      } catch (err) {
        commit("SEND_ARTICLE_FAILED", err.response.data.error);
        return Promise.reject("Error in saving article");
      }
    },
    async removeEntry({ commit, dispatch }, id) {
      commit("DELETE_ARTICLE", id);
      try {
        await api.delete(`entries/${id}`);
        await dispatch("getEntries");
        commit("DELETE_ARTICLE_SUCCESS");
      } catch (err) {
        commit("DELETE_ARTICLE_FAILED", err.response.data.error);
        return Promise.reject("Error in deleting article");
      }
    },
    async getSettings({ commit }) {
      commit("FETCHING_SETTINGS");
      const resp = await api.get("settings");
      console.log(resp.data.settings);
      commit("FETCHING_SETTINGS_SUCCESS", JSON.parse(resp.data.settings));
    },

    async editSettings({ commit, dispatch }, settings = {}) {
      await api.put("settings", settings);
    }
  }
});
