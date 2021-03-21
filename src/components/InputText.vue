<template>
  <input :type="type" @input="onInput" :value="modelValue" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  name: "InputText",
  props: {
    type: { type: String, default: "text" },
    modelValue: { type: String, default: "" },
  },
  setup(props, { emit }) {
    const onInput = (el: any) => {
      emit("update:modelValue", el.target.value);
    };
    return {
      onInput,
    };
  },
});
</script>
