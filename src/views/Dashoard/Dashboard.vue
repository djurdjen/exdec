<template>
  <header>
    <button @click="logout">Logout</button>
  </header>
  <router-view />
</template>

<script lang="ts">
import { ensureAuthorized, logout } from "@/domains/user/endpoints";
import { UserDataStore } from "@/domains/user/UserDataStore";
import { defineComponent } from "@vue/runtime-core";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Dashboard",
  setup() {
    const router = useRouter();
    const store = new UserDataStore();

    store.ensureUserIsAuthorized().catch(() => {
      router.replace({ name: "Login" });
    });

    const doLogout = async () => {
      await logout();
      router.push({ name: "Login" });
    };
    return {
      logout: doLogout,
      state: store.state,
    };
  },
});
</script>
