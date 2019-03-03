<template>
  <div class="home" v-if="showRoutes">
    <div @click="menuActive = true" class="home__header">
      <strong>Menu</strong>
    </div>
    <div :class="['home__nav', { active: menuActive }]">
      <router-link :to="{ name: 'Entries' }">Reizen</router-link>
      <router-link :to="{ name: 'Calculate' }">Berekenen</router-link>
      <router-link :to="{ name: 'Settings' }">Settings</router-link>
      <a href="#" @click.prevent="logout">Logout</a>
      <div class="home__underlay" @click="menuActive = false"></div>
    </div>
    <router-view class="home__view" />
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";

export default {
  name: "home",
  data() {
    return {
      showRoutes: false,
      menuActive: false
    };
  },
  watch: {
    $route: {
      handler() {
        this.menuActive = false;
      }
    }
  },
  async mounted() {
    try {
      await this.verifyToken(this.$store.state.token);
      await this.getSettings();
      this.showRoutes = true;
    } catch (err) {
      this.$router.push({ name: "Login" });
      Promise.reject(err);
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
@import "@/util.scss";

.home {
  &__underlay {
    position: fixed;
    left: 280px;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  &__header {
    height: 42px;
    padding: 12px;
    position: fixed;
    background-color: white;
    width: 100%;
    z-index: 5;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
  &__nav {
    display: none;
    position: fixed;
    flex-direction: column;
    background-color: white;
    top: 0;
    bottom: 0;
    left: 0;
    width: 280px;
    z-index: 10;
    padding-top: 30px;

    &.active {
      display: flex;
    }
    a {
      display: block;
      text-decoration: none;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      color: inherit;
      &:visited {
        color: inherit;
      }
      &.router-link-exact-active {
        font-weight: bold;
      }
    }
  }
  &__view {
    padding-top: 42px;
  }
}
</style>
