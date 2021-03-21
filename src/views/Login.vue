<template>
  <div class="login">
    <div class="login__container">
      <h1 class="light">Exdec</h1>
      <h2 class="light">Beheer je reiskosten, waar je ook bent!</h2>
      <form-component @onSubmit="doLogin">
        <error-message v-if="errorMessage">
          {{ errorMessage }}
        </error-message>
        <input-text
          v-model="credentials.username"
          placeholder="Gebruikersnaam"
        />
        <input-text
          v-model="credentials.password"
          type="password"
          placeholder="Wachtwoord"
        />
      </form-component>
      <router-link :to="{ name: 'Login' }" class="login__forgot"
        >Wachtwoord vergeten?</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { FormComponent, InputText, ErrorMessage } from "@/components";
import { login } from "@/utils/endpoints";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  components: { FormComponent, InputText, ErrorMessage },
  setup() {
    const router = useRouter();
    const errorMessage = ref("");
    const credentials = reactive({
      username: "",
      password: "",
    });
    const doLogin = () => {
      errorMessage.value = "";
      login(credentials)
        .then(() => router.push({ name: "Entries" }))
        .catch((err) => {
          errorMessage.value = err.message;
        });
    };
    return {
      credentials,
      doLogin,
      errorMessage,
    };
  },
});
</script>

<style lang="scss">
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
}
</style>
