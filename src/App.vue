<template>
  <div id="app"><router-view /></div>
</template>

<style lang="scss">
@import "@/util.scss";
* {
  box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: $blue;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
