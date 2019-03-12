<template>
  <label>
    {{ label }}
    <div class="input-container">
      <input
        :value="value"
        @input="$emit('input', $event.target.value)"
        :placeholder="placeholder"
        :type="type"
        :pattern="pattern"
      />
      <div v-if="!!$slots.default" class="input-unit">
        <slot></slot>
      </div>
    </div>
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

<style lang="scss">
.input-container {
  display: flex;
  align-items: center;
}
.input-unit {
  padding: 0 12px;
  font-size: 20px;
}
</style>
