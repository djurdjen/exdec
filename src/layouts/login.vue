<template>
  <div class="login">
    <h1>Exdec</h1>
    <form @submit.prevent="login()" v-if="mode === 'login'">
      <input type="email" v-model="username" placeholder="E-mailadres" />
      <input type="password" v-model="password" placeholder="Wachtwoord" />
      <span class="login__error">{{ errorMsg }}</span>
      <button type="submit" class="cta">Login</button>
      <a href="#" @click.prevent="mode = 'signup'">Maak een account</a>
    </form>
    <form name="new-user"  v-else-if="mode === 'signup'"  autocomplete="off" @submit.prevent="register">
      <input type="email" v-model="signup.username" name="new-email" placeholder="E-mailadres" autocomplete="off" />
      <input type="password" v-model="signup.password" name="new-password" placeholder="Nieuw wachtwoord"  autocomplete="off" />
      <input type="password" v-model="signup.repeatPassword" name="new-password-repeat" placeholder="Herhaal wachtwoord" />
            <span class="login__error">{{ signUperrorMsg }}</span>
      <button type="submit" class="cta">Registreer</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "home",
  data() {
    return {
      mode: 'login',
      signup: {
        username: "",
        password: "",
        repeatPassword: ""
      },
      username: "",
      password: "",
      errorMsg: "",
      signUperrorMsg: ""
    };
  },
  methods: {
    ...mapActions({
      doLogin: "login",
      doRegister: "register"
    }),
    async register() {
      try {
        this.signUperrorMsg = "";
        await this.doRegister({
          username: this.signup.username,
          password: this.signup.password
        })
        this.username = this.signup.username
        this.password = this.signup.password
        await this.login();
        
      } catch(err){
        this.signUperrorMsg = err.response.data.error;
      }
    },
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
  },
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
