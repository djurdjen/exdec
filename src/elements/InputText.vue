<template>
  <label>
    {{ label }}
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
      :type="type"
      :pattern="pattern"
    />
  </label>
</template>

<script>
export default {
  props: {
    value: { type: [Number, String], default: "" },
    label: { type: String, default: "" },
    pattern: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    type: { type: String, default: "text" }
  }
};
</script>

<style></style>
