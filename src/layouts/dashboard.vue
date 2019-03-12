<template>
  <div class="home" v-if="showRoutes">
    <div @click="menuActive = !menuActive" class="home__header">
      <div class="home__header-wrapper">
        <strong :class="{ cross: menuActive }">
          <span v-if="menuActive" class="home__header-close">×</span>
          <div class="home__header-bars" v-else>
            <span class="home__header-bar" v-for="i in 3" :key="i"></span>
          </div>
        </strong>
      </div>
    </div>
    <transition name="fade">
      <div v-if="menuActive" :class="['home__nav']">
        <router-link :to="{ name: 'Entries' }">Reizen</router-link>
        <router-link :to="{ name: 'Calculate' }">Berekenen</router-link>
        <router-link :to="{ name: 'Settings' }">Settings</router-link>
        <a href="#" @click.prevent="logout">Logout</a>
        <div class="home__underlay" @click="menuActive = false"></div>
      </div>
    </transition>
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
@import "@/variables.scss";

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
    left: 0;
    right: 0;
    background-color: white;
    width: 100%;
    z-index: 15;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 28px;
    &-bars {
      width: 22px;
      height: 17px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      .home__header-bar {
        width: 100%;
        display: block;
        height: 3px;
        background-color: $font-black;
      }
    }

    .cross {
      width: 24px;
      height: 24px;
      display: block;
      cursor: pointer;

      span {
        font-size: 27px;
        line-height: 1em;
        margin-top: -4px;
        display: block;
      }
    }
  }
  &__nav {
    display: flex;
    position: fixed;
    flex-direction: column;
    background-color: white;
    top: 0;
    bottom: 0;
    left: 0;
    width: 280px;
    z-index: 10;
    padding-top: 30px;
    margin-top: 42px;

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
