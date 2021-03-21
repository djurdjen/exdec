<template>
  <div class="input-radio__container">
    <label v-for="option in options" :key="option.value" class="input-radio">
      <input
        type="checkbox"
        :name="name"
        :checked="value === option.value"
        @change="$emit('input', option.value)"
      />
      <div class="input-radio__check">
        <Check :active="value === option.value" />
      </div>
      {{ option.label }}
    </label>
  </div>
</template>

<script>
import Check from "../components/Check.vue";
export default {
  components: { Check },
  props: {
    value: { type: [Boolean, Number, String], required: true },
    label: { type: String, default: "" },
    name: { type: String, default: "" },
    options: { type: Array, required: true },
  },
};
</script>

<style lang="scss">
@import "@/variables.scss";

.input-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 12px;

  &__container {
    display: flex;
  }

  &__check {
    margin-right: 12px;
    border: 2px solid $grey-border;
    border-radius: 4px;
  }

  input {
    display: none;
  }
}
</style>
