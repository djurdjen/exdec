<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
@import "@/util.scss";
* {
  box-sizing: border-box;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 auto;
  background-color: white;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: $primary;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
