<template>
  <div class="create">
    <form class="create__form" @submit.prevent="send">
      <select v-model="fieldData.transport">
        <option selected value="car">Auto</option>
        <option value="train">Trein</option>
        <option value="tram">Tram</option>
        <option value="bus">Bus</option>
      </select>
      <input
        v-if="fieldData.transport === 'car'"
        type="text"
        v-model="fieldData.kilometres"
        placeholder="Kilometers"
      />
      <input
        v-else
        type="text"
        v-model="fieldData.ticketPrice"
        placeholder="Prijs kaartje"
      />
      <input
        type="text"
        v-model="fieldData.description"
        placeholder="Beschrijving"
      />
      <input v-model="fieldData.date" placeholder="Datum" type="date" />
      <button>Send</button>
      <span
        v-if="entries.failed.send"
        v-for="(error, key) in entries.failed.send"
        class="create__error"
        :key="key"
        >{{ error }}</span
      >
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Vue from "vue";

export default {
  name: "CreateEntry",
  data() {
    return {
      fieldData: { ...this.dataModel() }
    };
  },
  computed: {
    ...mapState(["entries"]),
    valueLabel() {
      if (this.fieldData.transport === "car") {
        return "kilometres";
      }
      return "ticketPrice";
    }
  },
  methods: {
    ...mapActions(["sendEntry"]),
    createNewDate() {
      const date = new Date();
      const month = date.getMonth() + 1;
      return `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      }`;
    },
    resetData() {
      for (const key of Object.keys(this.$data.fieldData)) {
        Vue.set(this.fieldData, key, this.dataModel()[key]);
      }
    },
    dataModel() {
      return {
        kilometres: "",
        description: "",
        transport: "car",
        ticketPrice: "",
        date: this.createNewDate()
      };
    },
    async send() {
      await this.sendEntry({
        description: this.fieldData.description,
        date: this.fieldData.date,
        transport: this.fieldData.transport,
        [this.valueLabel]: this.fieldData[this.valueLabel].replace(",", ".")
      });
      this.resetData();
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
      padding: 6px;
      font-size: 15px;
    }
    textarea {
      margin-top: 20px;
      padding: 6px;
      width: 100%;
      font-size: 15px;
    }

    button {
      width: 100px;
      margin-top: 12px;
    }
  }
  &__error {
    color: red;
  }
}
</style>
