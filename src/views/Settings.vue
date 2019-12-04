<template>
  <div class="settings">
    <h1 class="settings__header">Instellingen</h1>

    <div class="settings__container">
      <InputText type="text" label="Naam" name="name" v-model="settings.name" />

      <InputText
        type="text"
        label="Bedrijf"
        name="company"
        v-model="settings.company"
      />

      <InputText
        type="text"
        label="Rekeningnummer"
        name="bankaccount"
        v-model="settings.bankAccount"
      />
      <InputText
        type="text"
        label="Kilometervergoeding"
        name="expensePerKilometer"
        v-model="settings.compensation"
      />
      <InputText
        label="Alternatief e-mailadres (hier worden declaratie bestanden naartoe gestuurd)"
        type="email"
        name="emailAlternative"
        v-model="settings.altEmail"
      />
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
      <span class="settings__error" v-for="(error, i) in errors" :key="i">{{
        error
      }}</span>
      <button @click.prevent="editSettings" type="submit">Pas aan</button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import InputText from "../elements/InputText.vue";
import { pushToast } from "../services/toaster.js";
import { mapState } from "vuex";

export default {
  components: { InputText },
  data() {
    return {
      settings: {}
    };
  },
  computed: {
    ...mapState({
      errors: state => state.errors.settings || []
    })
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
  display: flex;
  flex-direction: column;
  width: 100%;

  &__header {
    display: flex;
    align-items: center;
    padding: 12px;
    min-height: 60px;
    max-height: 60px;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
  &__container {
    padding: {
      top: 60px;
      left: 20px;
      right: 20px;
      bottom: 30px;
    }
    @include respond-to("medium-small") {
      padding-top: 20px;
    }

    label {
      margin-bottom: 20px;
    }
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
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  &__error {
    color: $red;
    display: block;
    margin-bottom: 20px;
  }
}
</style>
