<template>
  <div class="login">
    <h1>Exdec</h1>
    <form @submit.prevent="login()">
      <input type="text" v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <span class="login__error">{{ errorMsg }}</span>
      <button type="submit" class="cta">Login</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "home",
  data() {
    return {
      username: "",
      password: "",
      errorMsg: ""
    };
  },
  methods: {
    ...mapActions({
      doLogin: "login"
    }),
    async login() {
      try {
        this.errorMsg = "";
        await this.doLogin({
          username: this.username,
          password: this.password
        });
        this.$router.push({ name: "Entries" });
      } catch (err) {
        this.errorMsg = err.response.data;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";
.login {
  padding: 20px 40px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  &__error {
    color: $red;
  }
  button {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
