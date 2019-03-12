<template>
  <div class="calculate" v-if="Object.keys(entries).length">
    <!-- {{ entries }} -->
    <h1>Berekenen</h1>
    <InputDate label="Begindatum" v-model="beginDate" />
    <InputDate label="Einddatum" v-model="endDate" />
    <button class="calculate__button cta" @click.prevent="calculateTotals">
      Berekenen
    </button>

    <div v-if="total" class="calculate__total">
      <strong
        >Totaal te declareren:<br />
        <span>&euro; {{ total }},-</span></strong
      >
    </div>
    <div v-if="dataForExport" class="calculate__download">
      <a
        href="#"
        class="calculate__download-link"
        @click.prevent="exportToTable"
        ><span>Download PDF</span></a
      >
      <a href="#" class="calculate__download-link" @click.prevent="exportData"
        ><span>Download xls <strong>(pre-alpha)</strong></span></a
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import InputDate from "../elements/InputDate.vue";
import createXls from "../services/createXls.js";
import createPdf from "../services/createPdf.js";
import PdfTableDesign from "../components/PdfTableDesign.vue";
import Vue from "vue";

export default {
  name: "Calculate",
  components: { InputDate, PdfTableDesign },
  data() {
    return {
      beginDate: this.$createNewDate({ month: -1 }),
      endDate: this.$createNewDate(),
      total: null,
      dataForExport: null
    };
  },
  computed: {
    ...mapState({
      entries: state => state.entries.data,
      compensation: state => state.settings.compensation,
      settings: state => state.settings
    })
  },
  async mounted() {
    await this.getEntries();
  },

  methods: {
    ...mapActions(["getEntries"]),
    calculateTotals() {
      let values = Object.values(this.entries).filter(e => {
        const entryDate = new Date(e.date);
        return (
          entryDate <= new Date(this.endDate) &&
          entryDate >= new Date(this.beginDate)
        );
      });
      // add totals to value obj
      values = values.map(v => {
        return {
          ...v,
          total: Number(
            v.kilometres ? v.kilometres * this.compensation : v.ticketPrice
          )
        };
      });
      this.total = values
        .map(v => v.total)
        .reduce((a, b) => a + b)
        .toFixed(2);
      this.dataForExport = values;
    },
    exportData() {
      createXls(this.dataForExport);
    },
    exportToTable() {
      const ComponentClass = Vue.extend(PdfTableDesign);
      const instance = new ComponentClass({
        propsData: { fields: this.dataForExport }
      });
      const table = instance.$mount();
      createPdf(table.$el, this.dataForExport, {
        endDate: this.endDate,
        beginDate: this.beginDate,
        ...this.settings
      });
    }
  }
};
</script>

<style lang="scss">
.calculate {
  padding: {
    top: 60px;
    left: 20px;
    right: 20px;
  }
  &__total {
    text-align: center;
    display: block;
    padding: 20px 0;
    strong {
      span {
        font-size: 30px;
      }
    }
  }
  &__download {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
  }
  &__button {
    width: 100%;
    margin-top: 12px;
  }
  &__download-link {
    min-height: 40px;
    padding: 6px 12px;
    width: calc(50% - 6px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid grey;
    text-decoration: none;
    color: grey;
    text-align: center;
    border-radius: 4px;
    &:nth-of-type(odd) {
      margin-right: 6px;
    }
    &:nth-of-type(even) {
      margin-left: 6px;
    }
  }
}
</style>
