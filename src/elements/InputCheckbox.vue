<template>
  <label class="input-checkbox">
    <input
      type="checkbox"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    />
    <div class="input-checkbox__check">
      <Check :active="value" />
    </div>
    {{ label }}
  </label>
</template>

<script>
import Check from "../components/Check.vue";
export default {
  components: { Check },
  props: {
    value: { type: Boolean, required: true },
    label: { type: String, default: "" }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

.input-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;

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
