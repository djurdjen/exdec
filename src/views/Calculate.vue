<template>
  <div class="calculate">
    <h1 class="calculate__header">Berekenen</h1>
    <div class="calculate__body" v-if="Object.keys(entries).length">
      <div class="calculate__body-form">
        <p>
          Bereken hier de kosten over een bepaalde periode.<br />
          <i
            >(vraag toestemming aan de ontwikkelaar als je de uitdraai via mail
            wil kunnen ontvangen)</i
          >
        </p>
        <br />
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
          <button
            class="calculate__download-link"
            @click.prevent="exportToTable"
          >
            <span><i class="far fa-file-pdf"></i>Download PDF</span>
          </button>
          <button
            :disabled="mailLoading"
            class="calculate__download-link"
            @click.prevent="mailData"
          >
            <span
              ><i class="far fa-envelope"></i>Verstuur mail<strong>
                (Dev)</strong
              ></span
            >
          </button>
        </div>
      </div>
      <div class="calculate__body-table-preview" v-if="dataForExport">
        <div class="calculate__body-table-preview-wrapper">
          <pdf-table-design :fields="dataForExport" />
        </div>
      </div>
      <div v-else class="calculate__body-table-preview-empty">
        <i class="fa fa-table"></i>
        <div>Doe een berekening voor een PDF voorbeeld</div>
      </div>
    </div>
    <div v-else>
      Er is onvoldoende data om de reiskosten te berekenen
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import InputDate from "../elements/InputDate.vue";
import { pushToast } from "../services/toaster.js";
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
      settings: state => state.settings,
      mailLoading: state => state.loading.mailing
    })
  },
  async mounted() {
    await this.getEntries();
  },

  methods: {
    ...mapActions(["getEntries", "mail"]),
    calculateTotals() {
      let values = Object.values(this.entries).filter(e => {
        const entryDate = new Date(e.date);
        return (
          entryDate <= new Date(this.endDate) &&
          entryDate >= new Date(this.beginDate)
        );
      });
      // add totals to value obj
      if (!values.length) {
        this.total = null;
        return;
      }
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
    async mailData() {
      const file = await this.exportToTable("url");
      this.loading = true;
      try {
        await this.mail(file); // arrayBuffer extension
        pushToast("success", "Email is verzonden!");
      } catch (err) {
        pushToast("failed", "Er is iets mis gegaan!");
      }
    },
    async exportToTable(mode = "save") {
      const ComponentClass = Vue.extend(PdfTableDesign);
      const instance = new ComponentClass({
        propsData: { fields: this.dataForExport }
      });
      const table = instance.$mount();
      const resp = await createPdf(
        table.$el,
        this.dataForExport,
        {
          endDate: this.endDate,
          beginDate: this.beginDate,
          ...this.settings
        },
        mode
      );
      instance.$destroy();
      return resp;
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

.calculate {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    min-height: 60px;
    max-height: 60px;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }

  &__body {
    height: 100%;
    display: flex;
    width: 100%;

    &-form {
      width: 100%;
      border-right: 1px solid rgba(0, 0, 0, 0.15);
      padding: 20px;
      max-width: 100%;

      @include respond-to("medium-small") {
        max-width: 360px;
      }
    }

    &-table-preview {
      flex-grow: 1;
      overflow: auto;
      padding: 20px 20px 0 20px;
      display: none;
      @include respond-to("medium-small") {
        display: block;
      }
    }
    &-table-preview-wrapper {
      min-width: 700px;
    }
    &-table-preview-empty {
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: grey;
      font-size: 20px;
      display: none;
      text-align: center;
      @include respond-to("medium-small") {
        display: flex;
      }
      .fa {
        font-size: 40px;
        margin-bottom: 12px;
      }
    }
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
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
  }
  &__button {
    width: 100%;
    margin-top: 12px;
  }
  &__download-link {
    min-height: 40px;
    padding: 12px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid grey;
    text-decoration: none;
    color: grey;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 12px;
    font-weight: 500;

    i {
      font-size: 18px;
      margin-right: 12px;
    }
  }
}
</style>
