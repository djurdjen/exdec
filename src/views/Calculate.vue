<template>
  <div>
    Hier komt een calculatie systeem
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Calculate",
  computed: {
    ...mapState(["entries"])
  }
};
</script>

<style>
</style>
