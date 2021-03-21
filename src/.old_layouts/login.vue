<template>
  <div class="login">
    <div class="login__container">
      <h1>Exdec</h1>
      <h2>Beheer je reiskosten, waar je ook bent!</h2>
      <form @submit.prevent="login()" v-if="mode === 'login'">
        <label class="login__input email">
          <input type="email" v-model="username" placeholder="E-mailadres" />
        </label>
        <label class="login__input password">
          <input type="password" v-model="password" placeholder="Wachtwoord" />
        </label>
        <router-link :to="{ name: 'RequestPassword' }" class="login__forgot"
          >Wachtwoord vergeten?</router-link
        >

        <span class="login__error">{{ errorMsg }}</span>
        <button type="submit" class="cta cta--dark">Login</button>
        <a
          href="#"
          @click.prevent="mode = 'signup'"
          class="login__create-account"
          >Of maak een nieuw account</a
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
        <button type="submit" class="cta cta--dark">Registreer</button>
        <a href="#" class="login__signup-back" @click.prevent="mode = 'login'"
          >Terug naar inloggen</a
        >
      </form>
    </div>
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
        repeatPassword: "",
      },
      username: "",
      password: "",
      errorMsg: "",
      signUperrorMsg: "",
    };
  },
  methods: {
    ...mapActions({
      doLogin: "login",
      doRegister: "register",
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
          password: this.signup.password,
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
          password: this.password,
        });
        this.$router.push({ name: "Entries" });
      } catch (err) {
        this.errorMsg = err.response.data;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/variables.scss";
.login {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: $primary;

  &__container {
    height: 100%;
    max-width: 420px;
    padding: 20px 40px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    @include respond-to("medium-small") {
      height: 100vh;
    }
  }
  &__error {
    color: $red;
    margin-top: 12px;
    display: block;
  }
  &__input {
    position: relative;
    input {
      padding: 0 0 0 50px !important;
    }
    &.password,
    &.email {
      input {
        font-size: 11px;
      }
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

  &__forgot {
    color: white;
    display: block;
    text-align: right;
    font-size: 12px;
    cursor: pointer;
  }

  &__create-account,
  &__signup-back {
    color: white;
    display: block;
    margin: 20px 0;
  }
  button,
  .btn {
    width: 100%;
    margin-top: 20px;
  }
  h1 {
    font-size: 60px;
    color: white;
    padding-bottom: 0.15em;

    & + h2 {
      font-size: 16px;
      color: white;
      margin-bottom: 20px;
    }
  }
}
</style>
