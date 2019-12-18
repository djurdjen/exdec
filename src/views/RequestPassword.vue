<template>
  <div class="request-password">
    <div class="request-password__container" v-if="!mailSend">
      <h1>Vraag een nieuw wachtwoord aan</h1>
      <p>
        Vul je gebruikersnaam (dit is meestal je e-mail adres) in om een nieuw
        wachtwoord aan te vragen
      </p>
      <form autocomplete="off" @submit.prevent="doRequest">
        <label class="request-password__input">
          <input
            type="text"
            v-model="email"
            placeholder="Gebruikersnaam"
            autocomplete="off"
          />
        </label>
        <span class="request-password__error">{{ requestErrorMsg }}</span>
        <button type="submit" class="cta cta--dark">Stuur mail</button>
        <router-link
          class="request-password__signup-back"
          :to="{ name: 'Login' }"
          >Terug naar inloggen</router-link
        >
      </form>
    </div>
    <div v-else class="request-password__container denied">
      <div>
        Er is een mail verstuurd! Check je ongewenste email als de mail na 5
        minuten nog niet in je inbox zit.<br />
        <router-link :to="{ name: 'Login' }"
          >Keer hier terug naar de login pagina</router-link
        >
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
      email: "",
      mailSend: false,
      requestErrorMsg: ""
    };
  },
  methods: {
    ...mapActions({
      requestPassword: "requestPassword"
    }),
    async doRequest() {
      try {
        await this.requestPassword(this.email);
        this.mailSend = true;
      } catch (err) {
        this.requestErrorMsg = err.response.data;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";
.request-password {
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
    font-size: 11px;
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
