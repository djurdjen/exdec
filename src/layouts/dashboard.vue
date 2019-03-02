<template>
  <div class="home" v-if="showRoutes">
    <div class="home__nav">
      <router-link :to="{ name: 'Entries' }">Entries</router-link>
      <router-link :to="{ name: 'Calculate' }">Berekenen</router-link>
      <router-link :to="{ name: 'Settings' }">Settings</router-link>
      <a href="#" @click.prevent="logout">Logout</a>
    </div>
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";

export default {
  name: "home",
  data() {
    return {
      showRoutes: false
    };
  },
  async mounted() {
    try {
      await this.verifyToken(this.$store.state.token);
      await this.getSettings();
      this.showRoutes = true;
    } catch (err) {
      console.log(err);
      this.$router.push({ name: "Login" });
    }
  },
  methods: {
    ...mapActions(["verifyToken", "logoutUser", "getSettings"]),
    logout() {
      this.logoutUser().then(() => {
        window.location.href = "/login";
      });
    }
  }
};
</script>

<style lang="scss">
.home {
  &__nav {
    display: flex;
    a {
      display: block;
      text-decoration: none;
      padding: 10px 20px;
      color: inherit;
      &:visited {
        color: inherit;
      }
      &.router-link-exact-active {
        font-weight: bold;
      }
    }
  }
}
</style>
