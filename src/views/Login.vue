<template>
  <div class="login">
    <div class="login__container">
      <h1>Exdec</h1>
      <h2>Beheer je reiskosten, waar je ook bent!</h2>
    </div>
    <form-component @onSubmit="doLogin">
      <input-text v-model="credentials.username" placeholder="Gebruikersnaam" />
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
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { FormComponent, InputText } from "@/components";
import { login } from "../utils/endpoints";

export default defineComponent({
  name: "Login",
  components: { FormComponent, InputText },
  setup() {
    const credentials = reactive({
      username: "",
      password: "",
    });
    const doLogin = () =>
      login(credentials)
        .then(() => {
          // to dashboard
        })
        .catch((err) => {
          console.log(err);
        });
    return {
      credentials,
      doLogin,
    };
  },
});
</script>
