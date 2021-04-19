<template>
  <div>
    {{ state }}
  </div>
</template>

<script>
import { UserDataStore } from "@/domains/user/UserDataStore";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Entries",
  setup() {
    return { state: UserDataStore.getState() };
  },
});
</script>

<style></style>
