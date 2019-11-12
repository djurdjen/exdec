<template>
  <div class="create">
    <form class="create__form" @submit.prevent="" novalidate>
      <select v-model="fieldData.transport">
        <option
          v-for="(option, key) in transportation"
          :selected="key === 0"
          :key="key"
          :value="option.val"
          >{{ option.name }}</option
        >
      </select>

      <InputTextSelect
        v-model="fieldData.description"
        placeholder="Beschrijving"
        :choices="presets"
        :optionalDropdown="true"
      />
      <InputCheckbox
        v-model="saveAsPreset"
        label=" Sla beschrijving op als preset"
      />
      <InputText
        v-if="fieldData.transport === 'car'"
        pattern="\d*"
        v-model="fieldData.kilometres"
        placeholder="Kilometers"
      >
        <strong>km</strong>
      </InputText>
      <InputText
        v-else
        type="number"
        v-model="fieldData.ticketPrice"
        placeholder="Prijs kaartje"
      >
        <strong>&euro;</strong>
      </InputText>
      <a
        href="#"
        class="create__calculator"
        @click.prevent="openNsCalculator"
        v-if="fieldData.transport === 'train'"
      >
        Gereisd met NS? Bereken je prijs
      </a>
      <InputDate v-model="fieldData.date" />
      <div class="create__send-container">
        <a class="btn cta" @click="send">Voeg toe</a>
        <span v-if="failed.send" class="create__error">{{
          failed.send[0]
        }}</span>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { pushToast } from "../services/toaster.js";
import { nsModal } from "../services/modals/nsCalculateModal.js";
import InputDate from "../elements/InputDate.vue";
import InputText from "../elements/InputText.vue";
import InputTextSelect from "../elements/InputTextSelect.vue";
import InputCheckbox from "../elements/InputCheckbox.vue";
import Vue from "vue";
import { transportation } from "../services/presets.js";

export default {
  name: "CreateEntry",
  components: { InputDate, InputText, InputTextSelect, InputCheckbox },
  data() {
    return {
      fieldData: { ...this.dataModel() },
      saveAsPreset: false,
      transportation
    };
  },
  computed: {
    ...mapState({
      failed: state => state.entries.failed,
      presets: state => state.settings.presets || []
    }),
    valueLabel() {
      if (this.fieldData.transport === "car") {
        return "kilometres";
      }
      return "ticketPrice";
    }
  },
  methods: {
    ...mapActions(["sendEntry", "addPreset"]),
    resetData() {
      for (const key of Object.keys(this.$data.fieldData)) {
        if (!key.match(/transport|date/g)) {
          // keep same transport type
          Vue.set(this.fieldData, key, this.dataModel()[key]);
        }
      }
      this.saveAsPreset = false;
    },
    dataModel() {
      return {
        kilometres: "",
        description: "",
        transport: "car",
        ticketPrice: "",
        date: this.$createNewDate()
      };
    },
    async send() {
      try {
        await this.sendEntry({
          description: this.fieldData.description,
          date: this.fieldData.date,
          transport: this.fieldData.transport,
          [this.valueLabel]: this.fieldData[this.valueLabel].replace(",", ".")
        });
        if (this.saveAsPreset) {
          await this.addPreset(this.fieldData.description);
        }
        pushToast("success", "Reisdata succesvol opgeslagen");
        this.resetData();
      } catch (err) {
        pushToast("failed", "Er is iets mis gegaan met opslaan");
      }
    },
    async openNsCalculator() {
      try {
        const resp = await nsModal();
        this.fieldData.ticketPrice = resp.data;
      } catch (err) {
        console.warn(err);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.create {
  padding: 12px;
  &__form {
    display: flex;
    flex-direction: column;
    input[type="text"] {
      width: 100%;
      font-size: 15px;
    }
    textarea {
      margin-top: 20px;
      padding: 6px;
      width: 100%;
      font-size: 15px;
    }

    button {
      margin-top: 12px;
    }
  }
  &__field {
    margin: 6px 0 12px;
  }
  &__send-container {
    button {
      margin-right: 12px;
    }
  }
  &__error {
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px;
    color: red;
  }
  &__calculator {
    color: black;
    font-weight: 800;
    font-size: 14px;
    margin-left: 6px;
    margin-top: 6px;
  }
}
</style>
