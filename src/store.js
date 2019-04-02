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
    FETCHING_ENTRIES_SUCESS(state, entries) {
      Vue.delete(state.loading, "entries");
      const settingsObj = {};
      for (const entry of Object.values(entries)) {
        settingsObj[entry.id] = entry;
      }
      Vue.set(state.entries, "data", settingsObj);
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
    DELETE_ARTICLE_SUCCESS(state, id) {
      Vue.delete(state.entries.data, id);
      state.deleting = null;
    },
    DELETE_ARTICLE_FAILED(state, err) {
      state.error = err;
    },
    EDIT_ENTRY(state) {
      Vue.delete(state.entries.failed, "edit");
      Vue.set(state.loading, "edit-entry", true);
    },
    EDIT_ENTRY_SUCCESS(state, entry) {
      Vue.set(state.entries.data, entry.id, entry);
      Vue.delete(state.loading, "edit-entry");
    },
    EDIT_ENTRY_FAILED(state, msg) {
      Vue.delete(state.loading, "edit-entry");
      Vue.set(state.entries.failed, "edit", msg);
    },
    EDIT_ENTRY_CANCEL(state) {
      Vue.delete(state.entries.failed, "edit");
    },
    EDIT_SETTINGS(state) {
      Vue.set(state.loading, "edit-settings", true);
    },
    EDIT_SETTINGS_SUCCESS(state, settings) {
      Vue.set(state, "settings", settings);
      Vue.delete(state.loading, "edit-settings");
    },
    EDIT_SETTINGS_FAILED(state) {
      Vue.delete(state.loading, "edit-settings");
    },
    SEND_MAIL(state) {
      Vue.set(state.loading, "mailing", true);
    },
    SEND_MAIL_SUCCESS(state) {
      Vue.delete(state.loading, "mailing");
    }
  },
  actions: {
    // the login is for creating a token
    async login({ commit }, auth) {
      const resp = await api.post("login", auth);
      Object.assign(api.defaults, {
        headers: { "x-auth-token": resp.token }
      });
      localStorage.setItem("token", resp.token);
    },
    async register({ commit }, data) {
      return await api.post("register", data);
    },
    // the verify token function is for retrieving the user data that fits the token
    async verifyToken({ state, commit }) {
      // check if the token is not yet stored in the store and check the localStorage
      if (!state.token.length && localStorage.getItem("token")) {
        Object.assign(api.defaults, {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
      }
      const tokenData = await api.get("verify?=" + new Date().getTime()); // prevent cache
      commit("SET_USER_DATA", tokenData);
    },
    async logoutUser() {
      localStorage.removeItem("token");
    },
    async getEntries({ commit }) {
      commit("FETCHING_ENTRIES");
      const entries = await api.get("entries");
      commit("FETCHING_ENTRIES_SUCESS", entries);
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
    async editEntry({ commit }, entry) {
      commit("EDIT_ENTRY", entry.id);
      try {
        await api.put(`entries/${entry.id}`, entry);
        commit("EDIT_ENTRY_SUCCESS", entry);
      } catch (err) {
        commit("EDIT_ENTRY_FAILED", err.response.data.error);
        return Promise.reject("Error in saving article");
      }
    },
    async removeEntry({ commit }, id) {
      commit("DELETE_ARTICLE", id);
      try {
        await api.delete(`entries/${id}`);
        commit("DELETE_ARTICLE_SUCCESS", id);
      } catch (err) {
        commit("DELETE_ARTICLE_FAILED", err.response.data.error);
        return Promise.reject("Error in deleting article");
      }
    },
    async getSettings({ commit }) {
      commit("FETCHING_SETTINGS");
      const resp = await api.get("settings");
      commit("FETCHING_SETTINGS_SUCCESS", JSON.parse(resp.settings));
    },

    async addPreset({ state, dispatch }, preset) {
      if (!preset) {
        return;
      }
      const settingObj = JSON.parse(JSON.stringify(state.settings));
      settingObj.presets = settingObj.presets || [];
      settingObj.presets.push(preset);
      dispatch("editSettings", settingObj);
    },

    async editSettings({ commit }, settings = {}) {
      commit("EDIT_SETTINGS");
      try {
        await api.put("settings", settings);
        commit("EDIT_SETTINGS_SUCCESS", settings);
        Promise.resolve();
      } catch (err) {
        commit("EDIT_SETTINGS_FAILED", settings);
        Promise.reject(err);
      }
    },
    async mail({ commit, state }, file) {
      commit("SEND_MAIL");
      try {
        await api.post("mail", { file, email: state.user.username });
        commit("SEND_MAIL_SUCCESS");
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
});
