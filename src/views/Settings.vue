<template>
  <div class="settings">
    <h1>Instellingen</h1>
    <label>
      Naam
      <InputText type="text" v-model="settings.name" />
    </label>
    <label>
      Bedrijf
      <InputText type="text" v-model="settings.company" />
    </label>
    <label>
      Rekeningnummer
      <InputText type="text" v-model="settings.bankAccount" />
    </label>
    <label>
      Kilometervergoeding
      <InputText type="text" v-model="settings.compensation" />
    </label>
    <div v-if="settings.presets" class="settings__presets">
      <strong class="settings__presets-header">Presets</strong>
      <div
        class="settings__presets-single"
        v-for="(setting, key) in settings.presets"
        :key="key"
      >
        <div class="preset-name">{{ setting }}</div>

        <div class="preset-delete" @click="removePreset(key)">Verwijder</div>
      </div>
    </div>

    <button @click.prevent="editSettings" type="submit">Pas aan</button>
  </div>
</template>

<script>
import Vue from "vue";
import InputText from "../elements/InputText.vue";
import { pushToast } from "../services/toaster.js";

export default {
  components: { InputText },
  data() {
    return {
      settings: {}
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
    },
    removePreset(key) {
      Vue.delete(this.settings.presets, key);
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";
.settings {
  padding: {
    top: 60px;
    left: 20px;
    right: 20px;
  }
  @include respond-to("medium-small") {
    padding-top: 20px;
  }
  &__presets {
    width: 100%;
    margin: 12px 0 20px 0;

    &-header {
      display: block;
      margin-bottom: 12px;
    }
    &-single {
      border: 1px solid $grey-border;
      border-bottom: 0;
      padding: 6px;
      display: flex;
      align-items: center;

      &:last-child {
        border-bottom: 1px solid $grey-border;
      }
      .preset-name {
        font-size: 14px;
        width: 100%;
        padding-right: 12px;
        border-right: 1px solid $grey-border;
      }
      .preset-delete {
        color: red;
        min-width: 80px;
        padding: 0 12px;
        text-align: center;
        margin-left: auto;
      }
    }
  }
}
</style>
