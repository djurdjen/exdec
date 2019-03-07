<template>
  <label>
    {{ label }}
    <input
      :value="value"
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
  }
};
</script>

<style></style>
