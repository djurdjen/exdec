<template>
  <div class="about">
    <h1>Entries</h1>
    <div class="articles">
      <div
        class="articles__single"
        v-for="entry in entries.data"
        :key="entry.id"
      >
        <span v-if="entry.kilometres"
          ><strong>KM: </strong>{{ entry.kilometres }}</span
        >
        <span v-else><strong>Ticketprijs: </strong>{{ entry.ticketPrice }}</span
        ><br />
        <span><strong>Beschrijving: </strong>{{ entry.description }}</span
        ><br />
        <span><strong>Datum: </strong>{{ entry.date }}</span
        ><br />
        <a
          href="#"
          class="articles__delete"
          @click.prevent="removeEntry(entry.id)"
          >Delete</a
        >
      </div>
    </div>
    <CreateEntry />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CreateEntry from "../components/CreateEntry.vue";
export default {
  name: "Entries",
  components: { CreateEntry },
  computed: {
    ...mapState(["entries"])
  },
  async mounted() {
    await this.getEntries();
  },
  methods: {
    ...mapActions(["getEntries", "removeEntry"])
  }
};
</script>

<style lang="scss">
.articles {
  text-align: left;
  display: flex;
  flex-direction: column;
  &__single {
    padding: 12px 20px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    position: relative;
  }
  &__delete {
    position: absolute;
    right: 12px;
    top: 6px;
    color: red;
    text-decoration: none;
    text-transform: lowercase;
    font-size: 14px;
  }
}
</style>
