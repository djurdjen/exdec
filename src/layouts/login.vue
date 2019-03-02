<template>
  <div class="home">
    <form @submit.prevent="login()">
      <input type="text" v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit" >Login</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";

export default {
  name: "home",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapActions({
      doLogin: "login"
    }),
    async login() {
      await this.doLogin({ username: this.username, password: this.password });
      this.$router.push({ name: "Entries" });
    }
  }
};
</script>
