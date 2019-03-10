<template>
  <label>
    {{ label }}
    <input
      :value="dateValue()"
      @input="$emit('input', $event.target.value)"
      placeholder="Datum"
      type="date"
    />
  </label>
</template>

<script>
export default {
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

<style></style>
