<template>
  <div>
    <h2>Instellingen</h2>
    <form @submit.prevent="editSettings">
      <label> <input type="text" v-model="settings.compensation" /> </label>
      <button type="submit">Pas aan</button>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import { pushToast } from "../services/toaster.js";
export default {
  data() {
    return {
      settings: {
        compensation: 0.19
      }
    };
  },
  mounted() {
    Vue.set(this, "settings", this.$store.state.settings);
  },
  methods: {
    async editSettings() {
      try {
        await this.$store.dispatch("editSettings", this.settings);
        pushToast("success", "Instellingen zijn aangepast");
      } catch (err) {
        pushToast("failed", "Er is iets verkeerd gegaan...");
      }
    }
  }
};
</script>

<style></style>
