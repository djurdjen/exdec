<template>
  <div class="home" v-if="showRoutes">
    <Navigation />
    <router-view class="home__view" />
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";
import Navigation from "../components/Navigation.vue";

export default {
  name: "home",
  components: { Navigation },
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  @include respond-to("medium-small") {
    flex-direction: row;
    height: 100vh;
  }
  &__view {
    padding-top: 42px;

    @include respond-to("medium-small") {
      padding-top: 0;
      overflow: auto;
    }
    flex-grow: 1;
  }
}
</style>
