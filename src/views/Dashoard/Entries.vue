<template>
  <div>
    {{ userState }}
  </div>
</template>

<script>
import { getUserDataStore, UserDataStore } from "@/domains/user/UserDataStore";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Entries",
  setup() {
    const userState = getUserDataStore();
    return { userState: userState.state };
  },
});
</script>

<style></style>
