<template>
  <div class="create">
    <form class="create__form" @submit.prevent="" novalidate>
      <InputTextSelect
        :choices="presets"
        :optionalDropdown="true"
        v-model="fieldData.description"
        placeholder="Beschrijving"
        name="description"
        @onChoice="fillAllPresets"
      />
      <select name="transport-type" v-model="fieldData.transport">
        <option
          v-for="(option, key) in transportation"
          :selected="key === 0"
          :key="key"
          :value="option.val"
          >{{ option.name }}</option
        >
      </select>

      <InputText
        v-if="fieldData.transport === 'car'"
        pattern="\d*"
        v-model="fieldData.kilometres"
        placeholder="Kilometers"
        name="kilometres"
      >
        <strong>km</strong>
      </InputText>
      <InputText
        v-else
        type="number"
        v-model="fieldData.ticketPrice"
        placeholder="Prijs kaartje"
        name="ticket-price"
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
      <InputCheckbox v-model="saveAsPreset" label="Sla reis op als preset" />
      <InputDate v-model="fieldData.date" />
      <div class="create__send-container">
        <button class="btn cta" name="send-entry" @click="send">
          Voeg toe
        </button>
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
    fillAllPresets({ name, ticketPrice, kilometres, transport }) {
      this.fieldData = {
        ...this.fieldData,
        description: name,
        ...(ticketPrice && { ticketPrice }),
        ...(kilometres && { kilometres }),
        transport
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
          await this.addPreset({
            transport: this.fieldData.transport,
            name: this.fieldData.description,
            [this.valueLabel]: this.fieldData[this.valueLabel]
          });
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
        // eslint-disable-next-line
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
    margin-top: 12px;
    margin-bottom: 12px;
  }
}
</style>
