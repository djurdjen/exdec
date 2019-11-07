<template>
  <div class="login">
    <h1>Exdec</h1>
    <form @submit.prevent="login()" v-if="mode === 'login'">
      <label class="login__input email">
        <input type="email" v-model="username" placeholder="E-mailadres" />
      </label>
      <label class="login__input password">
        <input type="password" v-model="password" placeholder="Wachtwoord" />
      </label>
      <span class="login__error">{{ errorMsg }}</span>
      <button type="submit" class="cta">Login</button>
      <a href="#" @click.prevent="mode = 'signup'" class="btn"
        >Maak een account</a
      >
    </form>
    <form
      name="new-user"
      v-else-if="mode === 'signup'"
      autocomplete="off"
      @submit.prevent="register"
    >
      <label class="login__input email">
        <input
          type="email"
          v-model="signup.username"
          name="new-email"
          placeholder="E-mailadres"
          autocomplete="off"
        />
      </label>
      <label class="login__input password">
        <input
          type="password"
          v-model="signup.password"
          name="new-password"
          placeholder="Nieuw wachtwoord"
          autocomplete="off"
        />
      </label>

      <label class="login__input password">
        <input
          type="password"
          v-model="signup.repeatPassword"
          name="new-password-repeat"
          placeholder="Herhaal wachtwoord"
        />
      </label>
      <span class="login__error">{{ signUperrorMsg }}</span>
      <button type="submit" class="cta">Registreer</button>
      <a href="#" class="login__signup-back" @click.prevent="mode = 'login'"
        >Terug naar inloggen</a
      >
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "home",
  data() {
    return {
      mode: "login",
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
        if (this.signup.repeatPassword !== this.signup.password) {
          this.signUperrorMsg = "Wachtwoorden zijn niet gelijk";
          return Promise.reject();
        }
        await this.doRegister({
          username: this.signup.username,
          password: this.signup.password
        });
        this.username = this.signup.username;
        this.password = this.signup.password;
        await this.login();
      } catch (err) {
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
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";
.login {
  padding: 20px 40px;
  height: 90vh;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  &__error {
    color: $red;
  }
  &__input {
    position: relative;
    input {
      padding: 0 0 0 50px !important;
    }
    &.password,
    &.email {
      &:before {
        content: "";
        width: 14px;
        height: 14px;
        display: block;
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: {
          image: url("../assets/icons/lock.svg") !important;
          size: cover;
        }
      }
    }
    &.email {
      &:before {
        background: {
          image: url("../assets/icons/email.svg") !important;
        }
      }
    }
  }
  &__signup-back {
    color: black;
    display: block;
    margin-top: 20px;
  }
  button,
  .btn {
    width: 100%;
    margin-top: 20px;
  }
  h1 {
    font-size: 60px;
  }
}
</style>
