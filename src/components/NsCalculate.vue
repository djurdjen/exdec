<template>
  <div class="ns-calculate">
    <div class="ns-calculate__background" @click="closeModal"></div>
    <div class="ns-calculate__view">
      <div class="ns-calculate__header">
        <h2>Bereken je reis met NS</h2>
        <div class="ns-calculate__close" @click="closeModal">
          &times;
        </div>
      </div>
      <div class="ns-calculate__view-content">
        <InputTextSelect
          v-model="inputFrom"
          :style="{ zIndex: '5', marginTop: 0 }"
          placeholder="Van station"
          :choices="getMatches(inputFrom)"
          :suggestion="true"
        />
        <span v-if="invalidFromStation">
          Dit station wordt niet door herkent
        </span>
        <InputTextSelect
          v-model="inputTo"
          :style="{ zIndex: '4' }"
          placeholder="Naar station"
          :choices="getMatches(inputTo)"
          :suggestion="true"
        />
        <span v-if="invalidToStation">
          Dit station wordt niet door herkent
        </span>
        <br />
        <InputRadio
          v-model="travelClass"
          :options="[
            { value: 1, label: 'Eerste klas' },
            { value: 2, label: 'Tweede klas' }
          ]"
          label=" Korting (40%)"
        />
        <div class="ns-calculate__direct-calculations">
          <InputCheckbox v-model="discount" label=" Korting (40%)" />
          <InputCheckbox v-model="retour" label=" Retour" />
        </div>

        <div class="ns-calculate__price">{{ toPrice(price) }} &euro;</div>
      </div>
      <div class="ns-calculate__prompt">
        <button
          href="#"
          :disabled="!readyToCalc || loading"
          class="cta"
          @click.prevent="calculateCosts"
        >
          Bereken
        </button>
        <button
          href="#"
          :disabled="
            !(readyToCalc && price && !calculationInProgress) || loading
          "
          class="cta"
          @click.prevent="$emit('send', toPrice(price))"
        >
          Bevestig
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ns } from "../services/api.js";
import InputTextSelect from "../elements/InputTextSelect.vue";
import InputRadio from "../elements/InputRadio.vue";
import InputCheckbox from "../elements/InputCheckbox.vue";
export default {
  components: { InputTextSelect, InputRadio, InputCheckbox },
  data() {
    return {
      stations: [],
      inputFrom: "",
      inputTo: "",
      discount: false,
      travelClass: 2,
      price: null,
      loading: false,
      retour: false,
      calculationInProgress: true
    };
  },
  computed: {
    fromStation() {
      const found = this.stations.find(c => c.name === this.inputFrom);
      return found ? found.code : null;
    },
    toStation() {
      const found = this.stations.find(c => c.name === this.inputTo);
      return found ? found.code : null;
    },
    invalidFromStation() {
      return (
        this.inputFrom &&
        (!this.getMatches(this.inputFrom).length || !this.fromStation)
      );
    },
    invalidToStation() {
      return (
        this.inputTo &&
        (!this.getMatches(this.inputTo).length || !this.toStation)
      );
    },
    getMatches: ctx => input => {
      return ctx.stations
        .filter(e => {
          const check = new RegExp(input, "gi");
          return e.name.match(check);
        })
        .slice(0, 5);
    },
    readyToCalc() {
      return (
        !this.invalidFromStation &&
        !this.invalidToStation &&
        this.inputTo &&
        this.inputFrom
      );
    },
    observedDataValues() {
      return [
        this.inputFrom,
        this.inputTo,
        this.discount,
        this.travelClass,
        this.retour
      ];
    }
  },
  watch: {
    observedDataValues() {
      this.calculationInProgress = true;
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    toPrice(p) {
      if (!p || this.calculationInProgress) {
        return "-";
      }
      return (
        (p / 100) *
        (this.retour ? 2 : 1) *
        (this.discount ? 0.6 : 1)
      ).toFixed(2);
    },
    async getStations() {
      this.stations = await ns.get("get-stations");
    },
    async calculateCosts() {
      try {
        this.loading = true;
        const resp = await ns.post("trip", {
          travelClass: this.travelClass,
          fromStation: this.fromStation,
          toStation: this.toStation,
          plannedFromTime: new Date().toISOString(),
          excludeHighSpeedTrains: true
        });
        this.price = resp.priceInCents;
        this.$nextTick(() => {
          this.calculationInProgress = false;
        });
      } catch (err) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getStations();
  }
};
</script>

<style lang="scss" scoped>
@import "@/variables.scss";

.ns-calculate {
  font-family: Arial, Helvetica, sans-serif;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;

  &__background {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 5;
  }
  &__header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 50px;
    padding: 0 0 0 20px;
    background-color: $primary;
    color: white;
    display: flex;
    align-items: center;

    h2 {
      font-size: 20px;
      flex-grow: 1;
      margin: 0;
      padding: 0;
    }
  }
  &__close {
    font-size: 30px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
  }
  &__view {
    position: absolute;
    left: 50%;
    padding: 12px;
    top: 30px;
    transform: translateX(-50%);
    width: calc(100% - 20px);
    max-width: 500px;
    background-color: white;
    z-index: 10;
    @include respond-to("medium-small") {
      top: 50%;

      transform: translate(-50%, -50%);
    }
    &-content {
      overflow: auto;
      max-height: 80vh;
      padding: 56px 0 20px;
      font-weight: 300;
      font-size: 15px;
      letter-spacing: 0.2px;
      max-height: 380px;
      min-height: 380px;
      display: flex;
      flex-direction: column;
    }
  }
  &__prompt {
    display: flex;
    justify-content: flex-end;
    button {
      flex: 1;
      margin: 0;
      &:nth-of-type(2) {
        margin: 0 0 0 12px;
      }
    }
  }
  &__static {
    p {
      text-align: center;
      color: black;
    }
  }
  &__price {
    font-weight: bold;
    font-size: 26px;
    display: block;
    margin: 30px 0 0 12px;
  }
  &__direct-calculations {
    display: flex;
    margin-top: 12px;
    .input-checkbox {
      &:nth-of-type(1) {
        margin-right: 12px;
      }
    }
  }
}
</style>
