<template>
  <div class="nav">
    <div @click="menuActive = !menuActive" class="nav__header">
      <div class="nav__header-wrapper">
        <strong :class="{ cross: menuActive }">
          <span v-if="menuActive" class="nav__header-close">×</span>
          <div class="nav__header-bars" v-else>
            <span class="nav__header-bar" v-for="i in 3" :key="i"></span>
          </div>
        </strong>
      </div>
    </div>
    <div :class="['nav__nav', { active: menuActive }]">
      <router-link :to="{ name: 'Entries' }"
        ><i class="fas fa-car"></i> Reizen
      </router-link>
      <router-link :to="{ name: 'Calculate' }"
        ><i class="fas fa-calculator"></i> Berekenen</router-link
      >
      <router-link :to="{ name: 'Settings' }"
        ><i class="fas fa-cogs"></i> Settings</router-link
      >
      <a href="#" @click.prevent="logout"
        ><i class="fas fa-sign-out-alt"></i> Logout</a
      >
      <div class="nav__underlay" @click="menuActive = false"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { modal } from "@/services/modal.js";

export default {
  data() {
    return {
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
  methods: {
    ...mapActions(["verifyToken", "logoutUser", "getSettings"]),
    async logout() {
      try {
        await modal({
          copy: "Weet je zeker dat je wil uitloggen?",
          proceed: "Uitloggen",
          prompt: true
        });
        this.logoutUser().then(() => {
          window.location.href = "/login";
        });
      } catch (err) {
        // eslint-disable-next-line
        console.warn(err);
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

.nav {
  border-right: 1px solid rgba(0, 0, 0, 0.15);

  &__underlay {
    position: fixed;
    left: 280px;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    @include respond-to("medium-small") {
      display: none;
    }
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
    @include respond-to("medium-small") {
      position: relative;
      display: none;
    }
    &-bars {
      width: 22px;
      height: 17px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      @include respond-to("medium-small") {
        display: none;
      }
      .nav__header-bar {
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
    margin-top: 42px;
    display: none;

    @include respond-to("medium-small") {
      display: block;
      position: relative;
      padding-top: 0;
      margin-top: 0;
      width: 140px;
    }

    &.active {
      display: block;
    }

    a {
      display: block;
      text-decoration: none;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      color: inherit;

      @include respond-to("medium-small") {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      &:visited {
        color: inherit;
      }
      &.router-link-exact-active {
        font-weight: bold;
        background-color: $primary;
        color: white;
        @include respond-to("medium-small") {
          background-color: $primary;
          color: white;
        }
        i {
          color: white;
        }
      }
      i {
        font-size: 20px;
        margin-right: 12px;
        @include respond-to("medium-small") {
          margin: 0;
          font-size: 36px;
        }
      }
    }
  }
}
</style>
