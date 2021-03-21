<template>
  <form @submit.prevent="onSubmit">
    <slot />
    <button type="submit" class="cta cta--dark">Login</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "FormComponent",
  setup(props, { emit }) {
    const onSubmit = () => {
      emit("submit");
    };
    return {
      onSubmit,
    };
  },
});
</script>

<style></style>
