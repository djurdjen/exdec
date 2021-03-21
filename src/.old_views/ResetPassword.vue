<template>
  <div class="reset-password">
    <div class="reset-password__container" v-if="validToken && !resetSuccess">
      <h1>Stel een nieuw wachtwoord in</h1>
      <form autocomplete="off" @submit.prevent="doReset">
        <label class="reset-password__input password">
          <input
            type="password"
            v-model="reset.password"
            name="new-password"
            placeholder="Nieuw wachtwoord"
            autocomplete="off"
          />
        </label>

        <label class="reset-password__input password">
          <input
            type="password"
            v-model="reset.repeatPassword"
            name="new-password-repeat"
            placeholder="Herhaal wachtwoord"
          />
        </label>
        <span class="login__error">{{ resetErrorMsg }}</span>
        <button type="submit" class="cta cta--dark">Herstel wachtwoord</button>
        <router-link class="reset-password__signup-back" :to="{ name: 'Login' }"
          >Terug naar inloggen</router-link
        >
      </form>
    </div>
    <div
      class="reset-password__container success"
      v-else-if="validToken && resetSuccess"
    >
      <div>
        Je wachtwoord is aangepast! Keer terug naar de
        <router-link :to="{ name: 'Login' }">login pagina</router-link>
        om in te loggen!
      </div>
    </div>
    <div v-else class="reset-password__container denied">
      <div>
        Deze link is niet (meer) geldig. Keer terug naar de
        <router-link :to="{ name: 'Login' }">login pagina</router-link>
        om een nieuwe aanvraag te doen
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "home",
  data() {
    return {
      reset: {
        password: "",
        repeatPassword: "",
      },
      validToken: false,
      resetErrorMsg: "",
      resetSuccess: false,
    };
  },
  async mounted() {
    try {
      await this.validateResetToken(this.$route.query.token);
      this.validToken = true;
    } catch (err) {
      this.validToken = false;
    }
  },
  methods: {
    ...mapActions({
      resetPassword: "resetPassword",
      validateResetToken: "validateResetToken",
    }),
    async doReset() {
      if (this.reset.repeatPassword !== this.reset.password) {
        this.resetErrorMsg = "Wachtwoorden zijn niet gelijk";
        return;
      }
      await this.resetPassword({
        password: this.reset.password,
        token: this.$route.query.token,
      });
      this.resetSuccess = true;
    },
  },
};
</script>

<style lang="scss">
@import "@/variables.scss";
.reset-password {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: $primary;

  &__container {
    color: white;
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
    a {
      color: white;
      display: inline-block;
    }
  }
  &__error {
    color: $red;
  }
  &__input {
    position: relative;
    input {
      padding: 0 0 0 50px !important;
    }
    &.password {
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
  }

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
    font-size: 32px;
    color: white;
  }
}
</style>
