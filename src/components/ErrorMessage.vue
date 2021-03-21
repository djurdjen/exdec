<template>
  <div class="error-message" role="alert">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "ErrorMessage",
});
</script>

<style lang="scss">
.error-message {
  border: 1px solid $red;
  border-radius: 4px;
  padding: 4px 8px;
  color: $red;
  margin-top: 12px;
  display: block;
}
</style>
