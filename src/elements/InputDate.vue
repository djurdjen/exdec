<template>
  <label v-if="$isMobile.any()" class="inputDate">
    {{ label }}
    <input
      :value="dateValue()"
      @input="$emit('input', $event.target.value)"
      placeholder="Datum"
      type="date"
    />
  </label>
  <div v-else style="margin-top: 10px;">
    {{ label }}
    <datepicker
      :value="dateValue()"
      @input="$emit('input', $event)"
      name="uniquename"
    ></datepicker>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";

export default {
  components: { Datepicker },
  props: {
    value: { type: [Number, String], default: "" },
    label: { type: String, default: "" }
  },
  methods: {
    dateValue() {
      return this.$createNewDate({ existing: this.value });
    }
  }
};
</script>

<style lang="scss"></style>
