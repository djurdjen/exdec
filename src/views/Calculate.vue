<template>
  <div v-if="entries.length">
    <!-- {{ entries }} -->
    <InputDate v-model="beginDate" />
    <InputDate v-model="endDate" />
    <button @click.prevent="calculateTotals">Bereken</button>

    <div v-if="total" class="calculate__total">
      <strong
        >Totaal te declareren:<br />
        <span>&euro; {{ total }},-</span></strong
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import InputDate from "../elements/InputDate.vue";

export default {
  name: "Calculate",
  components: { InputDate },
  data() {
    return {
      beginDate: this.$createNewDate({ month: -1 }),
      endDate: this.$createNewDate(),
      total: null
    };
  },
  computed: {
    ...mapState({
      entries: state => state.entries.data,
      compensation: state => state.settings.compensation
    })
  },
  async mounted() {
    await this.getEntries();
  },
  methods: {
    ...mapActions(["getEntries"]),
    calculateTotals() {
      const values = this.entries.filter(e => {
        const entryDate = new Date(e.date);
        return (
          entryDate <= new Date(this.endDate) &&
          entryDate >= new Date(this.beginDate)
        );
      });
      this.total = values
        .map(v => {
          return Number(
            v.kilometres ? v.kilometres * this.compensation : v.ticketPrice
          );
        })
        .reduce((a, b) => a + b)
        .toFixed(2);
    }
  }
};
</script>

<style lang="scss">
.calculate {
  &__total {
    text-align: center;
    strong {
      span {
        font-size: 30px;
      }
    }
  }
}
</style>
